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

