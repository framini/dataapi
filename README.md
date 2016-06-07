# Dataapi: WIP (not ready to use)
## Intro
Basic module to declaratively define components using a `data-*` API.

## Getting Started

#### Defining a component:
HTML:
```html
<div data-api-component=”Example”></div>
```

JavaScript:
```javascript
import dataapi from 'dataapi';

const factories = new Map([['Example', Example]]);
const d = dataapi({
  factories
});
const comps = d.start() // comps will refer to a Map with all the initialized components
```

## How to use
### JS Setup
The module can be used with CommonJS and ES2015 modules.

* *Install the dependency (not yet published)*
```javascript
npm install dataapi --save-dev
```
* *Include the module*

#### CommonJS
```javascript
const dataapi = require('dataapi').default;
```

#### ES2015 modules
```javascript
import dataapi from 'dataapi';
```
* *Create a Map of factories*
The map should be created like:
```javascript
const factories = new Map([['Example', Example]]);
```
Where the value `Example` represents a Factory function, and the Key is a string that is gonna be used to create the relationship between our DOM element and the Factory. You could define as many as you want.

* *Call the dataapi factory method using the Map of factories*

```javascript
const d = dataapi({
  factories
});
```
In this step if you want to customize the namespace used to define your components, you could include the `namespaces` property, like so:

```javascript
const d = dataapi({
  namespaces: ['custom']
  factories
});
```

By doing this, you could then define your components like this in your HTML:
```html
<div data-custom-component=”Example”></div>
```

* *Call the `start()` method to boostrap your application*
```javascript
d.start();
```
Since all the API method return a Promise, you could do the following:

```javascript
d.then(function (cmp) {
  console.log('initialized Components', cmp);
}).catch(function(e) {
  console.log('Something went wrong :(', e)
});
```

## API
### .start()
*returns:* Promise that is gonna resolve to a Map containing all the initialized components
### .stop()
*returns:* Promise that is gonna resolve to a boolean indicating if the process of stoping all the components was successful
### .getInitializedComponents()
*returns:* Promise that is gonna resolve to a Map containing all the initialized components
### .getSkippedComponents()
*returns:* Promise that is gonna resolve to a Map containing all the components that were skipped during the initialization process. This could happens when a component was defined in the HTML using a Factory that hasn't been passed to the dataapi factory.

## Browser Support
* IE 10+
* Chrome
* Firefox
* Safari

This library has been written with a full ES2015 environment in mind. To make it work in older environments the following polyfill is required:
- https://babeljs.io/docs/usage/polyfill/
