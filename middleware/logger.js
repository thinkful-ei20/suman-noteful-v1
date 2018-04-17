'use strict';

const express = require('express');
const app = express();


function requestLogger(req,res,next) {
  const now = new Date();
  console.log(`${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
}

module.exports = {requestLogger};