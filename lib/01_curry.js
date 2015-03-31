'use strict';

var R = require('ramda');

//  words: a curried split example
//  words :: String -> [String]
var words = R.split(' ');

//  tripleList: a curried map and multiply example
//  tripleList :: [Number] -> [Number]
var tripleList = R.map(R.multiply(3));

var greater = function (a,b) { return a > b ? a : b; };
//  max: a curried reduce example
//  max: [Number] -> Number
var max = R.reduce(greater, -Infinity);

//  myMap: a map function defined in terms of curry and reduce
//  myMap :: (a -> b) -> [a] -> [b]
var myMap = R.curry(function(f,xs) {
  var concatProcessedArgs = function(acc,x) { return acc.concat([f(x)]); };
  return R.reduce(concatProcessedArgs,[],xs);
});

exports.words      = words;
exports.tripleList = tripleList;
exports.max        = max;
exports.myMap      = myMap;

