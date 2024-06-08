function monitor(callback, check = !!typeof window) {
  if (!callback) {
    return check;
  }
  if (callback.constructor === Boolean) {
    return check && window;
  }
  if (callback.constructor === Function) {
    return callback(check);
  }
  return check;
}

function overage({ parent, top }) {
  return parent || top;
}

function iframe({ constructor }) {
  return constructor === HTMLIFrameElement;
}

function inside() {
  return window.self !== overage(window);
}

function purify(target, hard = false) {
  if (iframe(target)) {
    return target.contentWindow;
  }

  return inside() || hard ? overage(target) : target.contentWindow;
}

function vexing(target, callback) {
  return inside() ? callback() : target.addEventListener('load', callback);
}

class postBridge {
  /**
   * @mode {post or receive}
   * @name {string}
   * ======== ======== ========
   */
  constructor(frame) {
    // VSCode Support
    if (typeof acquireVsCodeApi !== 'undefined') {
      // Set VSCode
      const { postMessage } = acquireVsCodeApi();

      // Add vSend Api by VSCode
      this.vSend = (proxy, data) => postMessage({ proxy, data });
    }

    // Environ Check
    this.bridge = monitor(true);

    // No Env
    if (!this.bridge) {
      return console.error(`Please run postBridge in Browser`);
    }

    // Frame Context
    this.frame = frame;

    // Proxy
    this.proxy = {};

    // Active
    this.active = undefined;

    // Event Listener
    this.bridge.addEventListener(
      // Name
      'message',

      // Handler
      (e) => {
        // Filter Event
        e = this.filter(e);

        // Really
        if (e) {
          const handler = this.proxy[e.data.proxy];
          delete e.data.proxy;
          handler && handler(e.data);
        }
      },

      false
    );

    // Set Active
    vexing(this.frame, () => (this.active = true));

    // Handler of Onload
    this.onloader = () => {};
  }

  // Filter
  filter(e) {
    return /^setImmediate/.test(e.data) || ['patterns', 'js'].includes(e.data.id) ? false : e;
  }

  // Receive Message
  receive(name, callback) {
    this.proxy[name] = callback;
  }

  // Send Message
  send(name, data) {
    // Set Proxy
    data.proxy = name;

    // Check Frame
    if (this.frame) {
      // Scope
      const that = this;

      // Has Load
      if (this.active) {
        // Purify Bubble
        purify(this.frame).postMessage(data, '*');

        // Stop as Handler
        return that.onloader();
      }

      // Stop
      return;
    }

    // Bubble
    purify(this.bridge, true).postMessage(data, '*');
  }

  // Survey
  survey(callback) {
    this.onloader = callback;
  }
}

export default monitor(() => ((window.postBridge = postBridge), postBridge));
