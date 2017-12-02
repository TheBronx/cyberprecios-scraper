'use strict';

var models = require('./models');

function saveProductPrice(product) {
  return models.Product.create({
    title: product.title,
    created: new Date()
  });
}

module.exports = {
  saveProductPrice: saveProductPrice
};
