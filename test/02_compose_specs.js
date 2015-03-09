'use strict';

var R = require('ramda');

var chai = require('chai'),
    expect = chai.expect;


/*
 * compose :: ((y -> z) -> (x -> y) -> ... -> (b -> c) -> (a -> b)) -> (a -> z)
 */
describe("Ramda's compose", function () {

  context('definition', function () {
    it('composes the given functions from right to left', function () {
      var triple = function(x) { return 3*x; };
      var minus1 = function(x) { return x-1; };
      var square = function(x) { return x*x; };

      expect(R.compose(triple, minus1, square)(10)).to.be.equal(297);
      expect(R.compose(square, minus1, triple)(10)).to.be.equal(841);
    });
  });

});


/*
 * pipe :: ((a -> b) -> (b -> c) -> ... -> (x -> y) -> (y -> z)) -> (a -> z)
 */
describe("Ramda's pipe", function () {

  context('definition', function () {
    it('pipes the given functions from left to right', function () {
      var triple = function(x) { return 3*x; };
      var minus1 = function(x) { return x-1; };
      var square = function(x) { return x*x; };

      expect(R.pipe(triple, minus1, square)(10)).to.be.equal(841);
      expect(R.pipe(square, minus1, triple)(10)).to.be.equal(297);
    });
  });

});
