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
 *
 *  Functor examples:
 *    - The Identity Functor: A simple wrapper around a value
 *    - The Maybe Functor: Captures a NULL check (the value inside MAY or MAY NOT be there)
 *    - The Either Functor: A structure for disjunctions (e.g.: computations that may fail)
 *                          Tipically used for handling errors in a pure functional way
 *    - The IO Functor: Builds a lazy computation (a function) that you can run anytime with runIO()
 */

'use strict';

var R      = require('ramda'),
    Either = require('data.either'),
    Future = require('data.task');

var Maybe    = require('./maybe_functor'),
    helpers  = require('./functor_helpers'),
    fmap     = helpers.fmap;


/*
 * Identity Functor Examples
 */
var add1    = fmap(R.add(1));
var mapHead = fmap(R.head);


/*
 * Maybe Functor Examples
 */
var maybeNameStartsWith = R.compose(fmap(R.head), Maybe, R.prop('name'));
var maybeParseInt       = R.compose(fmap(parseInt), Maybe);


/*
 * Either Functor Examples
 */
var eitherCheckIfUserIsActive = function(user) {
  return user.active ? Either.Right(user) : Either.Left('Your account is not active');
};
var welcomeUser       = R.compose(R.add('Welcome '), R.prop('name'));
var eitherGrantAccess = R.compose(fmap(welcomeUser), eitherCheckIfUserIsActive);

var eitherUserNameIsLargerThan3CharsValidator = function(x) {
  return x.length > 3 ? Either.Right(x) : Either.Left('Need length greater than 3');
};

var mockSave       = function (x) { console.log('User ' + x + ' saved!'); return x; };
var eitherSaveUser = R.compose(fmap(mockSave), eitherUserNameIsLargerThan3CharsValidator);


/*
 * IO Functor Examples
 */
var ioGetHref     = function () { return 'http://www.example.com'; }.toIO();
var getProtocol   = R.compose(R.head, R.split('/'));
var ioGetProtocol = R.compose(fmap(getProtocol), ioGetHref);

// Quite interesting:
//  A Maybe Functor (maybeLocalStorageForUser) inside an IO Functor (ioMaybeGetUserInLocalStorage)
//  Hence the double fmap (we need to go 2-functor-level-deep)

// The Maybe Functor
var maybeLocalStorageForUser = function(user) { return Maybe(JSON.stringify(user)) };

// The IO Functor with a Maybe Functor inside
var ioMaybeGetUserInLocalStorage = function(user) { return maybeLocalStorageForUser(user); }.toIO();

// The function we want to map over
var getUserEmail = R.compose(R.prop('email'), JSON.parse);

// The double fmap
var ioMaybeGetUserEmail = R.compose(fmap(fmap(getUserEmail)), ioMaybeGetUserInLocalStorage);


/*
 * Task (AKA Future) Functor Examples
 *
 *  Encapsulates an eventual value (like a "lazy" promise)
 *  Once that 'eventual value' is produced, it calls a given function with that 'eventual value'
 *  In order to kick all this off, you must 'fork'
 *  Another alternative to Callbacks
 *  It looks like an all-in-one Either + IO
 *
 *  Future Example: Anytime there's a click on the document, produce the id with a # in front of it:
 *    var makeDivTitleFrom = function(post){ return "<div>" + post.title + "</div>"; };
 *    var pageFuture = map(makeDivTitleFrom, http.get('/posts/2'));
 *
 *    It's lazy. Nothing really happens until you execute something like:
 *    pageFuture.fork(function(err){ throw(err); },
 *                    function(page){ $('#container').html(page); });
 */
var getPost = function(id) {
  return new Future(function(rej, res) {
    res({id: id, title: 'Love them futures'});
  });
};
var postTitleFuture = R.compose(R.map(R.prop('title')), getPost);

// We are extending(composing) the postTitleFuture computation to render the title in a div
var renderInADiv = function(x) { return "<div>" + x + "</div>"; };
var renderPostTitleInADivFuture = R.compose(R.map(renderInADiv), postTitleFuture);


exports.add1                                      = add1;
exports.mapHead                                   = mapHead;
exports.maybeNameStartsWith                       = maybeNameStartsWith;
exports.maybeParseInt                             = maybeParseInt;
exports.eitherCheckIfUserIsActive                 = eitherCheckIfUserIsActive;
exports.eitherGrantAccess                         = eitherGrantAccess;
exports.eitherUserNameIsLargerThan3CharsValidator = eitherUserNameIsLargerThan3CharsValidator;
exports.eitherSaveUser                            = eitherSaveUser;
exports.ioGetProtocol                             = ioGetProtocol;
exports.ioMaybeGetUserEmail                       = ioMaybeGetUserEmail;
exports.postTitleFuture                           = postTitleFuture;
exports.renderPostTitleInADivFuture               = renderPostTitleInADivFuture;

