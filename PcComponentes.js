'use strict';

var request = require('request');
var productsRepository = require('./ProductsRepository');

function retrieveProductUrl(product) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://eu1-search.doofinder.com/5/search?hashid=d9c752526286837ecd93ee20ff18249e&transformer=basic&rpp=1&query=' + product.pccomponentesId + '&query_counter=1&page=1',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0',
        'Origin': 'https://www.pccomponentes.com',
        'Referer': 'https://www.pccomponentes.com/'
      }
    }, function (error, response, body) {
      if (error) reject(error);
      else {
        if (response && (response.statusCode === 200)) {
          var parsed = JSON.parse(body);
          if (!parsed || parsed.results.length === 0) reject(new Error('PcComponentes search returned 0 results for product ' + product.pccomponentesId));
          else resolve(parsed.results[0].link);
        } else {
          reject(new Error('PcComponentes search returned an error'));
        }
      }
    });
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
        //reject(err);
        console.log(err);
        //TODO flag this product with an "error"=true so we don't process is again (see ProductsRepository to ignore incomplete and error products)
        resolve(product); //ignore this error, its not critical, we can continue processing products
      });
  });
}

module.exports = {
  retrieveAndSaveProductUrl: retrieveAndSaveProductUrl
};
