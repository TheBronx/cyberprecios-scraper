'use strict';

var database = require('./Database');
var productsRepository = require('./ProductsRepository');
var pccomponentes = require('./PcComponentes');
var amazon = require('./Amazon');

// get description
// get images
// get amazon price?
// get amazon url
function fillProductDetails(products) {
  return new Promise((resolve, reject) => {
    amazon.retrieveAndSaveAllProductDetails(products)
      .then(products => {
        resolve(products);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// get pccomponentes url
function fillPcComponentesUrl(products) {
  var p = Promise.resolve();

  products.forEach(function(product) {
    p = p.then(function(){ return pccomponentes.retrieveAndSaveProductUrl(product); });
  });

  return p;
}

function fillProducts(products) {
  return new Promise((resolve, reject) => {
    fillPcComponentesUrl(products)
      .then(() => {
        return fillProductDetails(products);
      })
      .then(() => {
        resolve(products);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

function processNextBatch() {
  console.log('Processing a batch of products!');
  return new Promise((resolve, reject) => {
    productsRepository.findIncompleteProducts(10, 1)
      .then(products => {
        if (products.length === 0) {
          console.log('All products processed!');
          resolve();
        } else {
          fillProducts(products).then(processNextBatch);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

database.connect()
  .then(() => {
    return processNextBatch();
  })
  .catch(err => {
    console.log(err);
  });
