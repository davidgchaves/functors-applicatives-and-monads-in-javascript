/*
 * The Identity Functor: A simple wrapper around a value
 */

'use strict';

// The actual Identity object
var _Identity = function(a) { this.val = a; };

// The Identity constructor
var Identity = function(a) { return new _Identity(a); };

// The Identity fmap implementation
_Identity.prototype.fmap = function(f) {
  return new _Identity(f(this.val));
};

module.exports = Identity;

