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
 *  Tipically used for handling errors in a pure functional way
 *
 *  Using the Data.Either implementation: https://github.com/folktale/data.either
 *  from the Folktale project: http://folktalejs.org
 */
var E = require('data.either');

describe('Either Functor', function () {

  describe('eitherGrantAccess', function () {
    it('returns a welcome message in an Either.Right if user is active', function () {
      var david = { active: true, name: 'David' };
      expect(eitherGrantAccess(david)).to.be.deep.equal(E.Right('Welcome David'));
    });

    it('returns an error message in an Either.Left if user is non-active', function () {
      var peter = { active: false, name: 'Peter' };
      expect(eitherGrantAccess(peter)).to.be.deep.equal(E.Left('Your account is not active'));
    });
  });

  describe('eitherUserNameIsLargerThan3CharsValidator', function () {
    it("returns the given value in an Either.Right when it's length is greater than 3", function () {
      expect(eitherUserNameIsLargerThan3CharsValidator('fprules64')).to.be.deep.equal(E.Right('fprules64'));
    });

    it('returns an error message in an Either.Left to non-active users', function () {
      expect(eitherUserNameIsLargerThan3CharsValidator('123')).to.be.deep.equal(E.Left('Need length greater than 3'));
    });
  });

  describe('eitherSaveUser (with side-effects)', function () {
    it("returns the saved user in an Either.Right", function () {
      expect(eitherSaveUser('fprules64')).to.be.deep.equal(E.Right('fprules64'));
    });

    it('returns an error message in an Either.Left to non-active users', function () {
      expect(eitherSaveUser('123')).to.be.deep.equal(E.Left('Need length greater than 3'));
    });
  });

});

var eitherCheckIfUserIsActive = function(user) {
  return user.active ? E.Right(user) : E.Left('Your account is not active');
};
var welcomeUser = R.compose(R.add('Welcome '), R.prop('name'));
var eitherGrantAccess = R.compose(fmap(welcomeUser), eitherCheckIfUserIsActive);

var eitherUserNameIsLargerThan3CharsValidator = function(x) {
  return x.length > 3 ? E.Right(x) : E.Left('Need length greater than 3');
};

var mockSave = function (x) { console.log('User ' + x + ' saved!'); return x; };
var eitherSaveUser = R.compose(fmap(mockSave), eitherUserNameIsLargerThan3CharsValidator);


/*
 * The IO Functor: Builds a lazy computation (a function) that you can run anytime with runIO()
 *
 *  Typically used to contain side effects
 *
 *  In this case, fmap appends the computation to a list (chain) of computations to run
 *
 *  Canibalizing the implementation from PointFree-Fantasy
 */

// Compute now!
var runIO = function(io) {
  return io.val.apply(this, [].slice.call(arguments, 1));
};

// The actual IO object
var _IO = function(fn) {
  this.val = fn;
  this.runIO = this.val;
};

// The IO constructor
var IO = function(fn) {
  return new _IO(fn);
};

_IO.of = function(x) {
  return IO(function() {
    return x;
  });
};
_IO.prototype.of = _IO.of;

// The list (chain) of computations fmap appends to
_IO.prototype.chain = function(g) {
  var io = this;
  return IO(function() {
    return g(io.val()).val();
  });
};

// The IO fmap implementation
_IO.prototype.fmap = function(f) {
  return this.chain(function(a) {
    return _IO.of(f(a));
  });
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

describe('IO Functor', function () {

  describe('ioGetProtocol', function () {
    it('returns the Protocol contained in a given web address', function () {
      expect(runIO(ioGetProtocol(null))).to.be.equal('http:');
    });
  });

});


var ioGetHref = function () { return 'http://www.example.com'; }.toIO();
var getProtocol = R.compose(R.head, R.split('/'));
var ioGetProtocol = R.compose(fmap(getProtocol), ioGetHref);

