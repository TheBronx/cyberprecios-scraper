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

function saveProductPictures(product, pictureDTOs) {
  var p = Promise.resolve();

  pictureDTOs.forEach(function(pictureDTO) {
    p = p.then(function(){ return saveProductPicture(product, pictureDTO); });
  });

  return p;
}

function saveProductPicture(product, pictureDTO) {
  return models.Picture.create({
    productId: product.id,
    url: pictureDTO.url
  });
}

/*
Incomplete means:
  - without description
  - without amazon url
  - without pccomponentes url
  - without photos //no need to query for this too
*/
function findIncompleteProducts(pageSize, pageNumber) {
  return new Promise((resolve, reject) => {
    models.Product.findAll({
      where: {
        description: null,
        pccomponentesURL: null,
        amazonURL: null
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

function savePcComponentesUrl(product, url) {
  return models.Product.update({
    pccomponentesURL: url
  }, {
    where: {
      id: product.id
    }
  });
}

function updateProductDetails(productDTO) {
  return new Promise((resolve, reject) => {
    models.Product.update({
      amazonURL: productDTO.amazonURL,
      description: productDTO.description
    }, {
      where: {
        id: productDTO.id
      }
    })
    .then(product => {
      saveProductPictures(productDTO, productDTO.pictures);
    })
    .then(() => {
      resolve(productDTO);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    });
  });
}

function updateProductsDetails(products) {
  var p = Promise.resolve();

  products.forEach(function(product) {
    if (!product.pictures) product.pictures = [];
    p = p.then(function(){ return updateProductDetails(product); });
  });

  return p;
}

module.exports = {
  createOrRetrieveProduct: createOrRetrieveProduct,
  saveProductPrice: saveProductPrice,
  saveProductPicture: saveProductPicture,
  saveProductPictures: saveProductPictures,
  findIncompleteProducts: findIncompleteProducts,
  savePcComponentesUrl: savePcComponentesUrl,
  updateProductsDetails: updateProductsDetails
};
