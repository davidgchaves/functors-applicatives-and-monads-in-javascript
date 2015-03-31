/*
 * The Maybe Functor: Captures a NULL check (the value inside MAY or MAY NOT be there)
 */

'use strict';

// The actual Maybe object:
var _Maybe = function(a) { this.val = a; };

// The Maybe constructor:
var Maybe = function(a) { return new _Maybe(a); };

// The Maybe fmap implementation
_Maybe.prototype.fmap = function(f) {
  return this.val ? Maybe(f(this.val)) : Maybe(null);
};

module.exports = Maybe;

