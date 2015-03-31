/*
 * The IO Functor: Builds a lazy computation (a function) that you can run anytime with runIO()
 *
 *  Typically used to contain side effects
 *
 *  In this case, fmap appends the computation to a list (chain) of computations to run
 *
 *  Canibalizing the implementation from PointFree-Fantasy
 */

'use strict';

// The actual IO object
var _IO = function(fn) {
  this.val   = fn;
  this.runIO = this.val;
};

// The IO constructor
var IO = function(fn) { return new _IO(fn); };

_IO.of = function(x) {
  return IO(function() { return x; });
};
_IO.prototype.of = _IO.of;

// The list (chain) of computations fmap appends to
_IO.prototype.chain = function(g) {
  var io = this;
  return IO(function() { return g(io.val()).val(); });
};

// The IO fmap implementation
_IO.prototype.fmap = function(f) {
  return this.chain(function(a) { return _IO.of(f(a)); });
};

// Monkey patching every JS function to support .toIO() in order to
// be able to easily pass arguments to the function inside the IO Functor:
//
//  USING THE IO CONSTRUCTOR (No args)
//    var email_io = IO(function () { return $(#email).val(); });
//
//  USING .toIO() (With args)
//    var get_value_io = function(selector) { return $(selector).val(); }.toIO();
//
// Every time you monkey patch, God kills a kitten
Function.prototype.toIO = function() {
  var self = this;
  return function(x) {
    var args = arguments;
    return IO(function() { return self.apply(this, args) });
  };
};

module.exports = IO;

