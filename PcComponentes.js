'use strict';

var productsRepository = require('./ProductsRepository');

function retrieveProductUrl(product) {
  return new Promise((resolve, reject) => {
    //TODO find the real URL
    resolve('http://pccomponentes.com/' + product.id);
  });
}

function retrieveAndSaveProductUrl(product) {
  return new Promise((resolve, reject) => {
    retrieveProductUrl(product)
      .then(url => {
        return productsRepository.savePcComponentesUrl(product, url);
      })
      .then(() => {
        resolve(product);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  retrieveAndSaveProductUrl: retrieveAndSaveProductUrl
};
