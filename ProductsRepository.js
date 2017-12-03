'use strict';

var models = require('./models');

function fixEanLength(ean) {
  while(ean.length < 13) ean = '0' + ean;
  return ean;
}

function createProduct(productDTO) {
  return new Promise((resolve, reject) => {
    models.Product.create({
      category: productDTO.category,
      title: productDTO.title,
      description: productDTO.description || null,
      pccomponentesURL: productDTO.pccomponentesURL || null,
      amazonURL: productDTO.amazonURL || null,
      pccomponentesId: productDTO.id,
      ean: fixEanLength(productDTO.ean)
    }).then(product => {
      resolve(product);
    }).catch(err => {
      reject(err);
    });
  });
}

function createOrRetrieveProduct(productDTO) {
  return new Promise((resolve, reject) => {
    models.Product.findOne({
      where: {
        pccomponentesId: productDTO.id
      }
    })
    .then(product => {
      if (product) {
        resolve(product);
      } else {
        createProduct(productDTO)
          .then(product => resolve(product))
          .catch(err => reject(err));
      }
    }).catch(err => {
      reject(err);
    });
  });
}

function saveProductPrice(productDTO) {
  return new Promise((resolve, reject) => {
    createOrRetrieveProduct(productDTO)
    .then(product => {
      models.Price.create({
        productId: product.id,
        price: productDTO.price,
        priceWithTaxes: productDTO.priceWithVat + productDTO.canon,
        stock: productDTO.inStock
      });
    }).then(price => {
      resolve(price);
    }).catch(err => {
      reject(err);
    });
  });
}

/*
Incomplete means:
  - without description
  - without amazon url
  - without pccomponentes url
  - without photos

But we just search for products without description for now
*/
function findIncompleteProducts(pageSize, pageNumber) {
  return new Promise((resolve, reject) => {
    models.Product.findAll({
      where: {
        description: null
      },
      offset: (pageNumber-1)*pageSize,
      limit: pageSize
    }).then(products => {
      resolve(products);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  createOrRetrieveProduct: createOrRetrieveProduct,
  saveProductPrice: saveProductPrice,
  findIncompleteProducts: findIncompleteProducts
};
