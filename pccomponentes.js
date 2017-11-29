'use strict';

var config = require('./config.json');
var request = require('request');
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
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file)
  });

  lineReader.on('line', function (line) {
    var parts = line.replace(/"/gi, '').split(';');
    var product = {
      "id": parseInt(parts[0], 10),
      "category": parts[1],
      "title": parts[2],
      "price": parseFloat(parts[3]),
      "priceWithVat": parseFloat(parts[4]),
      "inStock": parts[5] === 'Si',
      "ean": parts[8],
      "canon": parseFloat(parts[11])
    };
    //save product in database
    console.log(product);
  });
}


download(config.pccomponentes.url)
  .then(file => {
    parse(file);
  })
  .catch(err => {
    process.exit(1);
  });
