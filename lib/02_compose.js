'use strict';

var R = require('ramda');

var length = function(xs) { return xs.length; };
//  lengthsComposed: a composed function example in terms of map and split
//  lengthsComposed :: String -> [Number]
var lengthsComposed = R.compose(R.map(length), R.split(' '));

//  lengthsPiped: a piped function example in terms of map and split
//  lengthsPiped :: String -> [Number]
var lengthsPiped = R.pipe(R.split(' '), R.map(length));

//  firstTitleComposed: a composed function example
//  firstTitleComposed :: [Article] -> String
var firstTitleComposed = R.compose(R.prop('title'), R.head);

//  firstTitlePiped: a piped function example
//  firstTitlePiped :: [Article] -> String
var firstTitlePiped = R.pipe(R.head, R.prop('title'));

//  namesComposed: a composed map function example
//  namesComposed :: [Article] -> [String]
var namesComposed = R.map(R.compose(R.prop('name'), R.prop('author')));

//  namesPiped: a piped map function example
//  namesPiped :: [Article] -> [String]
var namesPiped = R.map(R.pipe(R.prop('author'), R.prop('name')));

//  isAuthorComposed: a composed function example
//  isAuthorComposed :: String -> [Article] -> Bool
var isAuthorComposed = function(name, artikles) { return R.compose(R.contains(name), namesComposed)(artikles); };

//  isAuthorPiped: a piped function example
//  isAuthorPiped :: String -> [Article] -> Bool
var isAuthorPiped = function(name, artikles) { return R.pipe(namesComposed, R.contains(name))(artikles); };

//  isAuthor: a neither composed nor piped function example
//  isAuthor  :: String -> [Article] -> Bool
var isAuthor1 = function(name, artikles) { return R.contains(name)(namesComposed(artikles)); };
var isAuthor2 = function(name, artikles) { return R.contains(name, namesComposed(artikles)); };

var fork = R.curry(function(lastly,f,g,xs) { return lastly(f(xs), g(xs)); } );
/*
 * lastly -> R.divide :: Number -> Number -> Number
 * f      -> R.sum    :: [Number] -> Number
 * g      -> length   :: [a] -> Number
 *
 * How does this work? HINT: CURRY!!!!
 *  - length receives the list [1,2,3,4,5] and produces its length (5)
 *  - sum receives the list [1,2,3,4,5] and produces its sum (15)
 *  - divide receives both results (15) and (5) and produces its division (3)
 */
//  avg: a forked (curried) example function
//  avg :: [Number] -> Number
var avg = fork(R.divide, R.sum, length);

exports.lengthsComposed    = lengthsComposed;
exports.lengthsPiped       = lengthsPiped;
exports.firstTitleComposed = firstTitleComposed;
exports.firstTitlePiped    = firstTitlePiped;
exports.namesComposed      = namesComposed;
exports.namesPiped         = namesPiped;
exports.isAuthorComposed   = isAuthorComposed;
exports.isAuthorPiped      = isAuthorPiped;
exports.isAuthor1          = isAuthor1;
exports.isAuthor2          = isAuthor2;
exports.avg                = avg;

