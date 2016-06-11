# Angular Event Bubbling

- Did you ever experience clicking somewhere and things like open drop down menus did not close?
Then your click event may have been stopped by event.stopPropagation(); and thus the correct
 functionality of other components is affected.

- Did you ever feel bad directly accessing the body element to register/unregister click events
 from inside your component that is nested inside the DOM and thought to your self:
 "I should not access higher level nodes that way."

### Angular Event Bubbling (and intercepting) has your solution.

- It comes with a directive that handels all your body click callbacks on place.
- It allows you to intercept your events on DOM-level for elements that shall prevent their own bubbling, but not that of other components.

## HowTo

### 1. Include Event Bubbling Module

Include event-bubbling.js after angular.js and before your app code as this example shows.

```html
<script type='text/javascript' src="angular.min.js"></script>
<script type='text/javascript' src="vendor/event-bubbling.js"></script>
<script type='text/javascript' src="app/app.js"></script>
```

### 2. Register Core Directive

To register body click event handling add the directive **pads-event-bubbling** to your body tag.

```html
<body pads-event-bubbling>
    ...
</body>
```

### 3. Usage For Modules

You are ready to use the event bubbling for your modules.

Expect you have a navigation that shall close when clicking somewhere on the page except when clicking inside the navigation to open further layers for example.

Your NavigationCtrl can use the **$padsEventBubbling** service to bind/unbind events.

```js
angular.module('myApp').controller('NavigationCtrl', function ($scope, $padsEventBubbling) {
	// Register body click for closing the navigation under the namespace "navigation.close".
	$padsEventBubbling.on('navigation.close', $scope.close); // $scope.close() is your close function.

	$scope.$on("$destroy", function () {
		// We reuse the chosen namespace to release the handler on scope destruction.
		$padsEventBubbling.off('navigation.close');
	});
});
```

Your template can now intercept clicks inside the navigation using the **pads-event-bubbling-intercept** directive.
Simply pass the namespace you want to intercept. Events bubbling throught this node will then intercept the given namespace handler. Other handlers will still execute as expected, as the bubbling is not stopped. With nested intercepts you can intercept multiple handlers.

```html
<ul class="navigation" pads-event-bubbling-intercept="navigation.close">
    <li>...</li>
</ul>
```

License
----

MIT


**Free Software for your personal enjoyment!**