#!/usr/bin/env node

var und = require('underscore');
var Parser = require('../backend/TwitterParser.js');

var tags = process.argv.slice(2);
var qString = tags.join(" OR ");

var p = new Parser({
    geocode: '52.523300,13.413770,10mi',
    q: qString,
    result_type: 'recent',
    until: '2014-06-22'
});
p.getTweets();

