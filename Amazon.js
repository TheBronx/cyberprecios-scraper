'use strict';

var config = require('./config.json');
var _ = require('underscore');
var parseString = require('xml2js').parseString;
var productsRepository = require('./ProductsRepository');
var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper(config.amazon);

function eanList(products) {
  return _.reduce(products, function(list, product) {
    if (!list) return '' + product.ean;

    return list += ',' + product.ean;
  }, null);
}

function findProductByEan(ean, products) {
  for (var i=0; i<products.length; i++) {
    if (products[i].ean == ean) return products[i];
  }
  return null;
}

function retrieveAllProductDetails(products) {
  return new Promise((resolve, reject) => {
    opHelper.execute('ItemLookup', {
      'SearchIndex': 'All',
      'IdType': 'EAN',
      'ItemId': eanList(products),
      'ResponseGroup': 'ItemAttributes,Images,VariationSummary'
    }).then((response) => {
        //console.log("Results object: ", response.result);
        //console.log("Raw response body: ", response.responseBody);
        parseString(response.responseBody, function (err, result) {
          if (err) reject(err);
          else {
            //console.log(JSON.stringify(result.ItemLookupResponse.Items));
            var amazonProducts = result.ItemLookupResponse.Items[0].Item;
            amazonProducts.forEach(amazonProduct => {
              var ean = amazonProduct.ItemAttributes[0].EAN[0];
              var product = findProductByEan(ean, products);
              if (product) {
                //console.log(amazonProduct.ItemAttributes[0].Title[0]);
                product.amazonURL = amazonProduct.DetailPageURL[0];
                if (amazonProduct.LargeImage) {
                  //TODO save images
                  //console.log(amazonProduct.LargeImage[0].URL[0]);
                }
                if (amazonProduct.ItemAttributes[0].ListPrice) {
                  //TODO save price
                  //console.log(amazonProduct.ItemAttributes[0].ListPrice[0].Amount[0]/100);
                }
                if (amazonProduct.ItemAttributes[0].Feature) {
                  product.description = amazonProduct.ItemAttributes[0].Feature[0];
                }
              }
            });

            resolve(products);
          }
        });
    }).catch((err) => {
        reject(err);
    });
  });
}

function retrieveAndSaveAllProductDetails(products) {
  return new Promise((resolve, reject) => {
    retrieveAllProductDetails(products)
      .then(products => {
        return productsRepository.updateProductsDetails(products);
      })
      .then(products => {
        resolve(products);
      })
      .catch(err => {
        reject(err);
      });
    resolve(products);
  });
}

module.exports = {
  retrieveAndSaveAllProductDetails: retrieveAndSaveAllProductDetails
};
