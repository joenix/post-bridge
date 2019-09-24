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

class postBridge {
  /**
   * @mode {post or receive}
   * @name {string}
   * ======== ======== ========
   */
  constructor(frame) {
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
      "message",

      // Handler
      e => {
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
  }

  // Filter
  filter(e) {
    return /^setImmediate/.test(e.data) ||
      ["patterns", "js"].includes(e.data.id)
      ? false
      : e;
  }

  // Receive Message
  receive(name, callback) {
    this.proxy[name] = callback;
  }

  // Send Message
  send(name, data) {
    // Set Proxy
    data.proxy = name;

    if (this.frame) {
      // Scope
      const that = this;

      // Frame Loaded
      this.frame.onload = function() {
        // Cross Data
        that.frame.contentWindow.postMessage(data, "*");
      };

      // Stop
      return;
    }

    // Bubble
    this.bridge.top.postMessage(data, "*");
  }
}

export default monitor(() => ((window.postBridge = postBridge), postBridge));
