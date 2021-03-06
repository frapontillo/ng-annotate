## v0.9.7 2014-07-11
 * more capable /* @ngInject */ (support function expression assignment)

## v0.9.6 2014-06-12
 * match myMod.invoke
 * more capable --regexp option (match any method callee, identifier or not)

## v0.9.5 2014-05-23
 * added ability to read from stdin and write to file
 * bugfix name of generated fn.$inject = [..] arrays (was: fn.$injects)

## v0.9.4 2014-05-19
 * stricter match: only match code inside of angular modules (except explicit)
 * ui-router declarations improvements
 * bugfix duplicated annotations arrays in case of redundant /* @ngInject */
 * indent generated fn.$inject = [..] arrays nicely

## v0.9.3 2014-05-16
 * /* @ngInject */ object literal support
 * bugfix ES5 strict mode oops
 * added more tools that support ng-annotate to README

## v0.9.2 2014-05-15
 * match $modal.open from angular-ui/bootstrap (experimental)
 * --stats option for runtime statistics (experimental)

## v0.9.1 2014-05-14
 * revert match .controller(name, ..) that was added in 0.9.0 because it
   triggered false positives

## v0.9.0 2014-05-13
 * explicit annotations using /* @ngInject */
 * --plugin option to load user plugins (experimental, 0.9.x may change API)
 * match $httpProvider.interceptors.push(function($scope) {})
 * match $httpProvider.responseInterceptors.push(function($scope) {})
 * match self and that as aliases to this for this.$get = function($scope){}
 * match .controller(name, ..) in addition to .controller("name", ..)
 * bugfix ui-router declarations
 * bugfix angular.module("MyMod").bootstrap(e, [], {}) disrupting chaining
 * even faster (~6% faster annotating angular.js)
 * add error array to API return object

## v0.8.0 2014-05-09
 * ngRoute support: $routeProvider.when("path", { .. })
 * even faster (~11% faster annotating angular.js)

## v0.7.3 2014-05-07
 * support obj.myMod.controller(..) in addition to myMod.controller(..)

## v0.7.2 2014-05-01
 * ui-router declarations improvements

## v0.7.1 2014-04-30
 * ui-router declarations improvements

## v0.7.0 2014-04-30
 * ui-router declarations support

## v0.6.0 2014-04-20
 * --single_quotes option to output '$scope' instead of "$scope"

## v0.5.0 2014-04-11
 * tweaked output: ["foo", "bar", ..] instead of ["foo","bar", ..]

## v0.4.0 2013-10-31
 * match angular.module("MyMod").animation(".class", function ..)

## v0.3.3 2013-10-03
 * bugfix .provider("foo", function($scope) ..) annotation. fixes #2

## v0.3.2 2013-09-30
 * bugfix angular.module("MyMod").constant("foo", "bar") disrupting chaining
 * match $provide.decorator (in addition to other $provide methods)

## v0.3.1 2013-09-30
 * bugfix angular.module("MyMod").value("foo", "bar") disrupting chaining

## v0.3.0 2013-09-30
 * ES5 build via defs
 * Grunt-support via grunt-ng-annotate

## v0.2.0 2013-09-06
 * better matching

## v0.1.2 2013-09-03
 * better README

## v0.1.1 2013-09-03
 * cross-platform shell script wrapper
