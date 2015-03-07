'use strict';

var R = require('ramda');

var chai = require('chai'),
    expect = chai.expect;

/*
 * split :: String -> String -> [String]
 */
describe("Ramda's split", function () {

  context('definition', function () {
    it('splits a string into an array of strings based on the given separator', function () {
      expect(R.split('/', 'usr/local/bin/node')).to.be.deep.equal(['usr', 'local', 'bin', 'node']);
    });
  });

  context('words: a curried split example', function () {
    it('returns a list of words in a string', function () {
      expect(words('one two three')).to.be.deep.equal(['one', 'two','three']);
    });
  });

});

var words = R.split(' ');


/*
 * multiply :: Number -> Number -> Number
 */
describe("Ramda's multiply", function () {

  context('definition', function () {
    it('performs a curried multiplication of two numbers', function () {
      expect(R.multiply(5, 4)).to.be.equal(20);
    });
  });

});

