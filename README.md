# post-bridge

Version: 2

> 重新封装 `postMessage`，使其更易用。
> A simple package to make `post-message` easily to use.

## how to install ?

```sh
yarn add post-bridge
# or
npm i post-bridge
```

## how to use ?

```js
import postBridge from 'post-bridge';

/**
 * @param { json } configure   - 对 `Bridge` 进行设置
 *  @prop { string } namespace - 必填, 表示当前 `Bridge` 实例的名称
 *  @prop { object } origin    - 选填，设置通信的来源对象，默认: window
 *  @prop { object } target    - 选填，设置通信的目标对象，默认: window
 *  @prop { string } alias     - 选填，设置消息别名，默认: space
 * @param { json } handlers    - `Bridge` 生命周期函数
 *  @method onConnect          - 当成功建立 `Bridge` 连接时触发
 *  @method onAnswer           - 发送消息时，响应成功或失败时触发
 *  @method onSend             - 发送消息前触发，可对发送数据进行加工处理
 * ======== ======== ========
 */
const Bridge = new postBridge(
  // Configure
  { namespace: `sample`, target: window.parent },

  // Handlers
  {
    // 成功建立连接时触发
    onConnect(scope) {
      console.log(scope);
    },

    // 发送消息时，响应成功或失败时触发
    onAnswer({ origin, target, timeout }) {
      if (timeout) {
        return console.error(`Response Timeout !!`);
      }
      console.log(`Send Message from ${origin} to ${target}`);
    },

    // 发送消息前触发，可对发送数据进行加工处理
    onSend(data) {
      return data;
    }
  }
);

/**
 * @name 监听消息
 * @param { string } space - 监听来自 `命名空间` 的消息
 * @param { function } action - 所监听消息的回调函数
 * ======== ======== ========
 */
Bridge.on('test', (data, origin) => {
  console.log(origin); // sample
  console.log(data.say); // hello world !!
});

/**
 * @name 发送消息
 * @param { string } space - 向 `命名空间` 发送消息
 * @param { json } data - 所发送消息的数据实体
 * ======== ======== ========
 */
Bridge.send('test', { say: `hello world !!` });
```
