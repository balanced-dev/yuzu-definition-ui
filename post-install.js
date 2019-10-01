// post-install.js

/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

'use strict'

var gentlyCopy = require('gently-copy');
var path = require('path');

var filesToCopy = ['dist'];

// User's local directory
var userPath = path.join(process.env.INIT_CWD, '_dev', 'yuzu-def-ui');

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath, {overwrite: true});