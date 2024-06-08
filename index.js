// Use Flatted
import { parse, stringify } from 'flatted';

// In VSCode
const inVSCode = !!process.env.VSCODE_PID;

// No Window
if (typeof window === 'undefined') {
  globalThis.window = {};
}

/**
 * @name define
 * ======== ======== ========
 */
function define(target) {
  return target || window;
}

/**
 * @name encode
 * ======== ======== ========
 */
function encode(value) {
  return this.deep ? stringify(value) : JSON.stringify(value);
}

/**
 * @name decode
 * ======== ======== ========
 */
function decode(value) {
  try {
    return this.deep ? parse(value) : JSON.parse(value);
  } catch (e) {
    return value;
  }
}

/**
 * @name trigger
 * ======== ======== ========
 */
async function trigger({ answer, [this.alias]: space, data, origin, source } = {}) {
  // Without DevTools
  if (this.blacks.includes(source)) return;

  // Parse Data
  data = decode.call(this, data);

  // Answer Message
  if (answer && this.handlers.onAnswer) {
    // Cleat Time and Anwser
    this.timer.clear(), await this.handlers.onAnswer({ origin, target: space, timeout: false });
  }

  // Trigger Action
  if (this.actions && this.actions[space]) {
    await this.actions[space](data, origin);
  }
}

/**
 * @name bind
 * ======== ======== ========
 */
function bind() {
  if (inVSCode) {
    this.origin.onDidReceiveMessage(async (data) => await trigger.call(this, data));
  } else {
    this.origin.addEventListener('message', async (event) => await trigger.call(this, event.data));
  }

  // [onConnect]
  if (this.handlers.onConnect) this.handlers.onConnect(this);
}

/**
 * @name setup
 * ======== ======== ========
 * @param { json } configure
 *  @prop { string } namespace
 *  @prop { object } origin
 *  @prop { object } target
 *  @prop { boolean } deep
 *  @prop { string } alias
 * @param { json } handlers
 *  @method onConnect
 *  @method onAnswer
 *  @method onSend
 * @param { ms } timeout
 * @param { array } blacks
 * ======== ======== ========
 */
function setup({ namespace, origin, target, deep = true, alias = `space` }, handlers = {}, timeout = 15, blacks = []) {
  // Check Namespace for Receive
  if (!namespace) return console.error(`Please check namespace ...`);

  // Set Namespace
  this.namespace = namespace;

  // Set Origin
  this.origin = define(origin);

  // Set Target
  this.target = define(target);

  // Set Deep
  this.deep = deep;

  // Set Alias
  this.alias = alias;

  // Black List
  this.blacks = ['react-devtools-content-script', ...blacks];

  // Handlers on Lifecycle
  this.handlers = handlers;

  // Actions for Cache Actions
  this.actions = {};

  // Timeout No Response
  this.timeout = timeout;

  // Timer
  this.timer = new Timer();
}

/**
 * Timer
 * ======== ======== ========
 */
class Timer {
  constructor(delay = 150, callback = () => {}) {
    this.out = null;
    this.delay = delay;
    this.callback = callback;
  }

  start(delay) {
    return new Promise((resolve) => {
      this.out = setTimeout(() => (this.callback(this), resolve(true), this.clear()), delay || this.delay);
    });
  }

  clear() {
    clearTimeout(this.out), (this.out = null);
  }
}

/**
 * @name `post-bridge`
 * @version 2.0
 * @author joenix
 * ======== ======== ========
 */
export default class Bridge {
  /**
   * @name constructor
   * ======== ======== ========
   * @param { json } configure
   *  @prop { string } namespace
   *  @prop { object } origin
   *  @prop { object } target
   *  @prop { boolean } deep
   *  @prop { string } alias
   * @param { json } handlers
   *  @method onConnect
   *  @method onAnswer
   *  @method onSend
   * ======== ======== ========
   */
  constructor(configure, handlers) {
    return setup.call(this, configure, handlers), bind.call(this), this;
  }

  /**
   * @name on
   * ======== ======== ========
   *  @param { string } space
   *  @param { function } action
   * ======== ======== ========
   */
  on(space, action) {
    this.actions[space] = action;
  }

  /**
   * @name send - promise
   * ======== ======== ========
   *  @param { string } space
   *  @param { any } data
   * ======== ======== ========
   */
  async send(space, data, answer = true) {
    // Get Result with onSend
    if (this.handlers.onSend) {
      data = await this.handlers.onSend(data);
    }

    // Encode Data
    data = encode.call(this, data);

    // Send Message
    this.target.postMessage({ [this.alias]: space, data, origin: this.namespace, answer }, '*');

    // Time Wait - 5 Seconds
    const wait = await this.timer.start(5000);

    // Timeout
    if (wait && this.handlers.onAnswer) {
      await this.handlers.onAnswer({ origin: this.namespace, target: space, timeout: true });
    }
  }
}
