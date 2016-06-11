
"use strict";

angular.module('pads.eventBubbling', [])
	.service('$padsEventBubbling', function () {
		var service = {},
			callbacks = {};

		/**
		 * Registers a click action under the give name(space) to enable
		 * interception using this name(space).
		 *
		 * @param {string} namespace
		 * @param {function} callback
		 */
		service.on = function (namespace, callback) {
			if (callbacks[namespace]) {
				console.log([
					'Callback',
					'"' + namespace + '"',
					'already registered.',
					'Forgot to release it previously?'
				].join(' '));
			}

			callbacks[namespace] = callback;
		};

		/**
		 * @param {string} namespace
		 */
		service.off = function (namespace) {
			delete callbacks[namespace]; // Allow garbage collection of connected scope.
		};

		/**
		 * Checks if the given name(space) already has a registered callback.
		 *
		 * @param {string} namespace
		 */
		service.has = function (namespace) {
			return !!callbacks[namespace];
		};

		/**
		 * Trigger callback execution for all registered actions
		 * except the intercepted ones.
		 *
		 * @param {Event} event
		 */
		service.trigger = function (event) {
			angular.forEach(callbacks, function (callback) {
				if (callback.padsIntercept) {
					delete callback.padsIntercept;
				}
				else {
					callback(event);
				}
			});
		};

		/**
		 * Intercepts click callback for given name(space).
		 *
		 * @param {string} namespace
		 */
		service.intercept = function (namespace) {
			if (callbacks[namespace]) {
				callbacks[namespace].padsIntercept = true;

				return;
			}

			console.log([
				'No callback registered for namespace',
				'"' + namespace + '"',
				'and thus cannot be intercepted.'
			].join(' '));
		};

		return service;
	})
	.directive('padsEventBubbling', function ($padsEventBubbling) {
		return {
			link: function ($scope, $element) {
				$element.on('click', $padsEventBubbling.trigger);
			}
		};
	})
	.directive('padsEventBubblingIntercept', function ($padsEventBubbling) {
		return {
			link: function ($scope, $element, attributes) {
				function clickCallback() {
					$padsEventBubbling.intercept(attributes.padsEventBubblingIntercept);
				}

				$element.on('click', clickCallback);

				$scope.$on('$destroy', function() {
					$element.off('click', clickCallback);
				});
			}
		};
	});