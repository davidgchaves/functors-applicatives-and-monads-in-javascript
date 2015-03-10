/*
 * JUST ENOUGH CATEGORY THEORY:
 *
 *  1 - FORMING A CATEGORY:
 *
 *    You need a composition function and an identity function to form a CATEGORY:
 *      compose :: (b -> c) -> (a -> b) -> (a -> c)
 *      id      :: a -> a
 *
 *  2 - CATEGORY LAWS:
 *
 *    LEFT IDENTITY:  compose(id,f)            == f
 *    RIGHT IDENTITY: compose(f,id)            == f
 *    ASSOCIATIVITY:  compose(compose(f,g), h) == compose(f, compose(g,h))
 *
 *  3 - CATEGORY LAWS USING HASKELL NOTATION:
 *
 *    LEFT IDENTITY:  id . f      = f
 *    RIGHT IDENTITY: f . id      = f
 *    ASSOCIATIVITY:  (f . g) . h = f . (g . h)
 */

/*
 * FUNCTORS:
 *
 *  Any object or data structure you can map over
 *
 *  MAP IS THE KEY:
 *    You CAN'T call a function over a Functor
 *    You HAVE TO MAP the function over the Functor (AKA LIFTING)
 *      we lift our function into the Functor
 *
 *  MAP:
 *    (1) Takes the value out of its context to apply the function over it (lifting the function)
 *    (2) Boxes the resulting value back up into it's original context
 */

'use strict';

var R = require('ramda');

var chai = require('chai'),
    expect = chai.expect;

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
  return obj.fmap(f);
});


/*
 * The Identity Functor: A simple wrapper around a value
 */

// The actual Identity object
var _Identity = function(a) { this.val = a; };

// The Identity constructor
var  Identity = function(a) { return new _Identity(a); };

// The Identity fmap implementation
_Identity.prototype.fmap = function(f) {
  return new _Identity(f(this.val));
};

describe('Identity Functor', function () {

  describe('add1', function () {
    it('increments a value inside the Functor', function () {
      expect(add1(Identity(6))).to.be.deep.equal(Identity(7));
    });
  });

});

var add1 = fmap(R.add(1));

