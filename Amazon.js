'use strict';

var config = require('./config.json');
var _ = require('underscore');
var productsRepository = require('./ProductsRepository');
var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper(config.amazon);

function eanList(products) {
  console.dir('There are ' + products.length + ' products');

  return _.reduce(products, function(list, product) {
    if (!list) return '' + product.ean;

    return list += ',' + product.ean;
  }, null);
}

function retrieveAllProductDetails(products) {
  console.log(eanList(products));

  return new Promise((resolve, reject) => {
    opHelper.execute('ItemLookup', {
      'SearchIndex': 'All',
      'IdType': 'EAN',
      'ItemId': eanList(products),
      'ResponseGroup': 'ItemAttributes,Images,VariationSummary'
    }).then((response) => {
        //console.log("Results object: ", response.result);
        //console.log("Raw response body: ", response.responseBody);
        resolve(products);
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
