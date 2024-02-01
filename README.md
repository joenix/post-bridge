# post-bridge

> A sample package for easily to post message between Pages and iFrames

## get started

```sh
yarn add post-bridge
# or
npm i post-bridge
```

## how to use ?

### 1. Send Message -- From Page to Frame

> `in Page`

```js
// use post-bridge
import postBridge from 'post-bridge';

// get frame node
const frame = document.querySelector(`#frame`);

// create bridge instance
const bridge = new postBridge(frame);

// send message to iframe
bridge.send('fromPageToFrame', { key: 'value' });
```

> `in Frame`

```js
// use post-bridge
import postBridge from 'post-bridge';

// create bridge instance
const bridge = new postBridge(window);

// receive message from page
bridge.receive('fromPageToFrame', (data) => {
  console.log(data);
});
```

### 2. Send Message -- From Frame to Page

> `in Frame`

```js
// use post-bridge
import postBridge from 'post-bridge';

// create bridge instance
const bridge = new postBridge(window);

// send message to page
bridge.send('fromFrameToPage', { key: 'value' });
```

> `in Page`

```js
// use post-bridge
import postBridge from 'post-bridge';

// get frame node
const frame = document.querySelector(`#frame`);

// create bridge instance
const bridge = new postBridge(frame);

// receive message from iframe
bridge.receive('fromFrameToPage', (data) => {
  console.log(data);
});
```
