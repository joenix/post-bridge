# post-bridge

> a sample post message for cross sandbox.

## get started

```sh
yarn add post-bridge
# or
npm i post-bridge
```

## how to use ?

### 1. Send Message -- From Page to Frame

> in Page

```js
// Import Package
import postBridge from 'post-bridge';

// Get Frame Node
const frame = document.querySelector(`#frame`);

// New Bridge
const bridge = new postBridge(frame);

// Send Message to Frame
bridge.send('fromPageToFrame', { key: 'value' });
```

> in Frame

```js
// Import Package
import postBridge from 'post-bridge';

// New Bridge
const bridge = new postBridge(window);

// Receive Message From Page
bridge.receive('fromPageToFrame', (data) => {
  console.log(data);
});
```

### 2. Send Message -- From Frame to Page

> in Frame

```js
// Import Package
import postBridge from 'post-bridge';

// New Bridge
const bridge = new postBridge(window);

// Send Message to Frame
bridge.send('fromFrameToPage', { key: 'value' });
```

> in Page

```js
// Import Package
import postBridge from 'post-bridge';

// Get Frame Node
const frame = document.querySelector(`#frame`);

// New Bridge
const bridge = new postBridge(frame);

// Receive Message From Page
bridge.receive('fromFrameToPage', (data) => {
  console.log(data);
});
```
