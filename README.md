# current-url

[![npm version](https://badge.fury.io/js/current-url.svg)](https://badge.fury.io/js/current-url)

Get the current URL isomorphically.

## Installation

```
yarn add current-url
```

## Usage

In the browser call the function with no arguments:

```js
import { currentUrl } from 'current-url';

currentUrl();
```

On the server call the function with a Node HTTP request object as the first argument:

```js
import { currentUrl } from 'current-url';

currentUrl(req);

// Ignore proxies
currentUrl(req, { ignoreProxies: true });
```

In both cases the function returns a `URL` object.

## Options

### `ignoreProxies`

Type: `object`\
Default: `false`

By default, the `currentUrl` function will take into account potential URL
rewrites made by proxies, load balancers, etc. along the way (as long as these
append special HTTP headers to the request). Use this option to disable that
behaviour.
