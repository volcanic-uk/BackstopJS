var fs = require('../util/fs');
var path = require('path');
var map = require('p-map');
var version = require('../../package.json').version;

module.exports = {
  execute: function (config) {
    return new Promise((resolve, reject) => {
      console.log('BackstopJS version ' + version);
      resolve(0);
    });
  }
};
