/*!
 * UMD Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.dynamicLoadingDemo = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';
  var dynamicLoadingDemo = {}
  dynamicLoadingDemo.testing = 'testing';
  console.log('loading dynamicLoadingDemo')
  return dynamicLoadingDemo;
});
