'use strict';

var models = require('./models');

function createProduct(productDTO) {
  return new Promise((resolve, reject) => {
    models.Product.create({
      category: productDTO.category,
      title: productDTO.title,
      pccomponentesId: productDTO.id,
      ean: productDTO.ean
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
        stock: productDTO.inStock
      });
    }).then(price => {
      resolve(price);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  createOrRetrieveProduct: createOrRetrieveProduct,
  saveProductPrice: saveProductPrice
};
