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

  context('lengthsComposed: a composed function example in terms of map and split', function () {
    it('produces the lengths of the words in a string', function () {
      expect(lengthsComposed('Once upon a time there was')).to.be.deep.equal([4,4,1,4,5,3]);
    });
  });

});

var length = function(xs) { return xs.length; };
var lengthsComposed = R.compose(R.map(length), R.split(' '));


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

  context('lengthsPiped: a piped function example in terms of map and split', function () {
    it('produces the lengths of the words in a string', function () {
      expect(lengthsPiped('Once upon a time there was')).to.be.deep.equal([4,4,1,4,5,3]);
    });
  });

});

var lengthsPiped = R.pipe(R.split(' '), R.map(length));

/*
 * head :: [a] -> a
 */
describe("Ramda's head", function () {

  context('definition', function () {
    it('returns the head (first element) of a list', function () {
      expect(R.head(['one','two','three'])).to.be.equal('one');
    });
  });

});


/*
 * prop :: k -> {k: v} -> v
 */
describe("Ramda's prop", function () {

  context('definition', function () {
    it('returns the value of the given property', function () {
      expect(R.prop('key', {key: 'value'})).to.be.equal('value');
      expect(R.prop('key')({key: 'value'})).to.be.equal('value');
    });
  });

});


/*
 * contains :: a -> [a] -> Boolean
 */
describe("Ramda's contains", function () {

  context('definition', function () {
    it('returns true if the specified item is in the list', function () {
      expect(R.contains(6)([3,6,9])).to.be.true;
    });
    it('returns false otherwise', function () {
      expect(R.contains(0)([3,6,9])).to.be.false
    });
  });

});


/*
 * Playing with the articles data structure
 */
var articles = [
  {
    title: 'Everything Sucks',
    url: 'http://do.wn/sucks.html',
    author: {
      name: 'Debbie Downer',
      email: 'debbie@do.wn'
    }
  },
  {
    title: 'If You Please',
    url: 'http://www.geocities.com/milq',
    author: {
      name: 'Caspar Milquetoast',
      email: 'hello@me.com'
    }
  }
];

describe("Playing with 'articles'", function () {

  describe('firstTitleComposed: a composed function example', function () {
    it("returns the first title of the 'articles' data structure", function () {
      expect(firstTitleComposed(articles)).to.be.equal('Everything Sucks');
    });
  });

  describe('firstTitlePiped: a piped function example', function () {
    it("returns the first title of the 'articles' data structure", function () {
      expect(firstTitlePiped(articles)).to.be.equal('Everything Sucks');
    });
  });

  describe('namesComposed: a composed map function example', function () {
    it("returns the author names in the 'articles' data structure", function () {
      expect(namesComposed(articles)).to.be.deep.equal(['Debbie Downer', 'Caspar Milquetoast']);
    });
  });

  describe('namesPiped: a piped map function example', function () {
    it("returns the author names in the 'articles' data structure", function () {
      expect(namesPiped(articles)).to.be.deep.equal(['Debbie Downer', 'Caspar Milquetoast']);
    });
  });

  describe('isAuthorComposed: a composed function example', function () {
    it("checks if a given person is an author in the 'articles' data structure", function () {
      expect(isAuthorComposed('Wrong Person', articles)).to.be.false;
      expect(isAuthorComposed('Debbie Downer', articles)).to.be.true;
    });
  });

  describe('isAuthorPiped: a piped function example', function () {
    it("checks if a given person is an author in the 'articles' data structure", function () {
      expect(isAuthorPiped('Wrong Person', articles)).to.be.false;
      expect(isAuthorPiped('Debbie Downer', articles)).to.be.true;
    });
  });

});

var firstTitleComposed = R.compose(R.prop('title'), R.head);
var firstTitlePiped    = R.pipe(R.head, R.prop('title'));

var namesComposed      = R.map(R.compose(R.prop('name'), R.prop('author')));
var namesPiped         = R.map(R.pipe(R.prop('author'), R.prop('name')));

var isAuthorComposed  = function(name, artikles) { return R.compose(R.contains(name), namesComposed)(artikles); };
var isAuthorPiped     = function(name, artikles) { return R.pipe(namesComposed, R.contains(name))(artikles); };

