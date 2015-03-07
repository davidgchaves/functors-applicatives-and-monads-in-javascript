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


/*
 * map :: (a -> b) -> [a] -> [b]
 */
describe("Ramda's map", function () {

  context('definition', function () {
    it('produces a new list with the supplied function applied to every element of the supplied list', function () {
      var triple = function(x) { return x * 3; };
      expect(R.map(triple, [1,2,3,4])).to.be.deep.equal([3,6,9,12]);
    });
  });

  context('tripleList: a curried map and multiply example', function () {
    it('triples every number in a list', function () {
      expect(tripleList([1,2,3,4])).to.be.deep.equal([3,6,9,12]);
    });
  });

});

var tripleList = R.map(R.multiply(3));


/*
 * reduce :: ((a -> b) -> a) -> a -> [b] -> a
 *           (foldl in Haskell)
 */
describe("Ramda's reduce (foldl)", function () {

  context('definition', function () {
    it('reduces the list (and the initial element) by applying the supplied function', function () {
      var add = function(a,b) { return a+b; };
      expect(R.reduce(add, 20, [1,2,3,4])).to.be.equal(30);
    });
  });

  context('max: a curried reduce example', function () {
    it('returns the largest number on a list', function () {
      expect(max([1,-3483,9,7,2])).to.be.equal(9);
      expect(max([-21,-3483,-2,-1])).to.be.equal(-1);
    });
  });

});

var greater = function (a,b) { return a > b ? a : b; };
var max = R.reduce(greater, -Infinity);

