'use strict';

var R      = require('ramda'),
    Either = require('data.either');

var chai   = require('chai'),
    expect = chai.expect;

var Identity = require('../lib/identity_functor'),
    Maybe    = require('../lib/maybe_functor'),
    IO       = require('../lib/io_functor'),
    helpers  = require('../lib/functor_helpers'),
    fmap     = helpers.fmap,
    runIO    = helpers.runIO;

var lib = require('../lib/03_functors'),
    add1                                      = lib.add1,
    mapHead                                   = lib.mapHead,
    maybeNameStartsWith                       = lib.maybeNameStartsWith,
    maybeParseInt                             = lib.maybeParseInt,
    eitherCheckIfUserIsActive                 = lib.eitherCheckIfUserIsActive,
    eitherGrantAccess                         = lib.eitherGrantAccess,
    eitherUserNameIsLargerThan3CharsValidator = lib.eitherUserNameIsLargerThan3CharsValidator,
    eitherSaveUser                            = lib.eitherSaveUser,
    ioGetProtocol                             = lib.ioGetProtocol,
    ioMaybeGetUserEmail                       = lib.ioMaybeGetUserEmail,
    postTitleFuture                           = lib.postTitleFuture;

/*
 * The Identity Functor: A simple wrapper around a value
 */
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


/*
 * The Maybe Functor: Captures a NULL check (the value inside MAY or MAY NOT be there)
 */
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


/*
 * The Either Functor: A structure for disjunctions (e.g.: computations that may fail)
 *
 *  Tipically used for handling errors in a pure functional way
 *
 *  Using the Data.Either implementation: https://github.com/folktale/data.either
 *  from the Folktale project: http://folktalejs.org
 */
describe('Either Functor', function () {

  describe('eitherGrantAccess', function () {
    it('returns a welcome message in an Either.Right if user is active', function () {
      var david = { active: true, name: 'David' };
      expect(eitherGrantAccess(david)).to.be.deep.equal(Either.Right('Welcome David'));
    });

    it('returns an error message in an Either.Left if user is non-active', function () {
      var peter = { active: false, name: 'Peter' };
      expect(eitherGrantAccess(peter)).to.be.deep.equal(Either.Left('Your account is not active'));
    });
  });

  describe('eitherUserNameIsLargerThan3CharsValidator', function () {
    it("returns the given value in an Either.Right when it's length is greater than 3", function () {
      expect(eitherUserNameIsLargerThan3CharsValidator('fprules64')).to.be.deep.equal(Either.Right('fprules64'));
    });

    it('returns an error message in an Either.Left to non-active users', function () {
      expect(eitherUserNameIsLargerThan3CharsValidator('123')).to.be.deep.equal(Either.Left('Need length greater than 3'));
    });
  });

  describe('eitherSaveUser (with side-effects)', function () {
    it("returns the saved user in an Either.Right", function () {
      expect(eitherSaveUser('fprules64')).to.be.deep.equal(Either.Right('fprules64'));
    });

    it('returns an error message in an Either.Left to non-active users', function () {
      expect(eitherSaveUser('123')).to.be.deep.equal(Either.Left('Need length greater than 3'));
    });
  });

});


/*
 * The IO Functor: Builds a lazy computation (a function) that you can run anytime with runIO()
 */
describe('IO Functor', function () {

  describe('ioGetProtocol', function () {
    it('returns the Protocol contained in a given web address', function () {
      expect(runIO(ioGetProtocol(null))).to.be.equal('http:');
    });
  });

  describe('ioMaybeGetUserEmail', function () {
    it('returns the user email wrapped in a Maybe Functor', function () {
      var david = { user: 'David', email: 'david@example.com' };
      expect(runIO(ioMaybeGetUserEmail(david))).to.be.deep.equal(Maybe('david@example.com'));
    });

    it('returns Maybe(null) for users with null email', function () {
      var peter = { user: 'Peter', email: null };
      expect(runIO(ioMaybeGetUserEmail(peter))).to.be.deep.equal(Maybe(null));
    });
  });

});


/*
 * The Task (AKA Future) Functor: An Either+IO all-in-one functor (or a 'lazy' promise)
 */
describe('Task (AKA Future) Functor', function () {

  describe('postTitleFuture', function() {
    it('returns a Future of the title of the post with a given id', function() {
      var postId = 3;
      var err = function(x){ throw err; }
      postTitleFuture(postId).fork(err,
                                   function(title) { expect(title).to.be.equal('Love them futures'); });
    });
  });

});

