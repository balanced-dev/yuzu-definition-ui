// post-install.js

/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

'use strict'

var gentlyCopy = require('gently-copy');
var fs = require('fs');

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

deleteFolderRecursive(process.env.INIT_CWD + '/_dev');

var filesToCopy = ['./dist/yuzu-def-ui'];

// User's local directory
var userPath = process.env.INIT_CWD + '/_dev';

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath, {overwrite: true});