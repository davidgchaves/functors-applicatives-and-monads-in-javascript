'use strict';

var R = require('ramda');

/*
 * A POINT-FREE FMAP:
 *
 *  Using a regular fmap:
 *    Identity(3).fmap(add(1))
 *
 *  Using our curried 'point-free' fmap:
 *    fmap(add(1), Identity(3))
 *  or explicitly using it's curried nature:
 *    fmap(add(1))(Identity(3))
 *
 * The curried (point-free) fmap implementation we are going to use:
 */
var fmap = R.curry(function(f,obj) {
  return obj.fmap ? obj.fmap(f) : obj.map(f);
});


// Compute IO now!
var runIO = function(io) { return io.val.apply(this, [].slice.call(arguments, 1)); };

exports.fmap  = fmap;
exports.runIO = runIO;

