'use strict';

var config = require('./config.json');

var database = require('./Database');
var models = require('./models');
var request = require('request');
var LineByLineReader = require('line-by-line');
var fs = require('fs');

function download(url) {
  return new Promise((resolve, reject) => {
    request.get(url)
      .on('error', function(err) {
        reject(err);
      })
      .pipe(fs.createWriteStream('prices.csv'))
      .on('finish', function() {
        resolve('prices.csv');
      });
  });
}

function parse(file) {
  var lineReader = new LineByLineReader(file);

  lineReader.on('line', function (line) {
  	lineReader.pause();

    var parts = line.replace(/"/gi, '').split(';');
    var product = {
      'id': parseInt(parts[0], 10),
      'category': parts[1],
      'title': parts[2],
      'price': parseFloat(parts[3]),
      'priceWithVat': parseFloat(parts[4]),
      'inStock': parts[5] === 'Si',
      'ean': parts[8],
      'brand': parts[10],
      'canon': parseFloat(parts[11])
    };

    models.Product.create({
      title: product.title,
      created: new Date()
    }).then(function() {
      lineReader.resume();
    }).catch(function(err) {
      console.log(err);
      lineReader.resume();
    });
  });

  lineReader.on('error', function (err) {
    console.log(err);
  });

  lineReader.on('end', function () {
  	//console.log('end');
  });

}

database.connect()
  .then( () => {
    return download(config.pccomponentes.url);
  })
  .then(file => {
    parse(file);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
