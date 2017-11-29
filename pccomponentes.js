'use strict';

var config = require('./config.json');
var request = require('request');
var fs = require('fs');

request.get(config.pccomponentes.url)
  .on('error', function(err) {
    console.log(err)
  })
  .pipe(fs.createWriteStream('prices.csv'))
