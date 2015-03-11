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
  return obj.fmap ? obj.fmap(f) : obj.map(f);
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

  describe('mapHead', function () {
    it('gets the head (first element) of an Array wrapped inside the Functor', function () {
      var xs = Identity(['do', 're', 'mi', 'fa', 'sol', 'la', 'si']);
      expect(mapHead(xs)).to.be.deep.equal(Identity('do'));
    });
  });

});

var add1    = fmap(R.add(1));
var mapHead = fmap(R.head);


/*
 * The Maybe Functor: Captures a NULL check (the value inside MAY or MAY NOT be there)
 */

// The actual Maybe object:
var _Maybe = function(a) { this.val = a; };

// The Maybe constructor:
var  Maybe = function(a) { return new _Maybe(a); };

// The Maybe fmap implementation
_Maybe.prototype.fmap = function(f) {
  return this.val ? Maybe(f(this.val)) : Maybe(null);
};

describe('Maybe Functor', function () {

  describe('maybeNameStartsWith', function () {
    it("gets the user's name initial wrapped in a Maybe Functor", function () {
      var user = { id: 4, name: 'David', email: 'david@example.com' }
      expect(maybeNameStartsWith(user)).to.be.deep.equal(Maybe('D'));
    });

    it("returns a Maybe(null) value when the user's name is not present", function () {
      var user = { id: 5, name: '', email: 'peter@example.com' }
      expect(maybeNameStartsWith(user)).to.be.deep.equal(Maybe(null));
    });
  });

  describe('maybeParseInt', function () {
    it('returns the parsed int wrapped in a Maybe Functor', function () {
      expect(maybeParseInt("6")).to.be.deep.equal(Maybe(6));
    });

    it('returns the bad input wrapped in a Maybe Functor when the given string is not parseable as an int', function () {
      expect(maybeParseInt("NaN")).to.be.deep.equal(Maybe(NaN));
    });
  });

});

var maybeNameStartsWith = R.compose(fmap(R.head), Maybe, R.prop('name'));
var maybeParseInt       = R.compose(fmap(parseInt), Maybe);


/*
 * The Either Functor: A structure for disjunctions (e.g.: computations that may fail)
 *
 * Using the Data.Either implementation: https://github.com/folktale/data.either
 * from the Folktale project: http://folktalejs.org
 */
var E = require('data.either');

