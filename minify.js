!function(){"use strict";function t(t,e=!0){return t?t.constructor===Boolean?e&&window:t.constructor===Function?t(e):e:e}class e{constructor(e){if(this.bridge=t(!0),!this.bridge)return console.error("Please run postBridge in Browser");this.frame=e,this.proxy={},this.active=void 0,this.bridge.addEventListener("message",(t=>{if(t=this.filter(t)){const e=this.proxy[t.data.proxy];delete t.data.proxy,e&&e(t.data)}}),!1),this.onloader=()=>{}}filter(t){return!/^setImmediate/.test(t.data)&&!["patterns","js"].includes(t.data.id)&&t}receive(t,e){this.proxy[t]=e}send(t,e){if(e.proxy=t,this.frame){const t=this;return this.frame.isLoad?void this.frame.contentWindow.postMessage(e,"*"):void this.frame.addEventListener("load",(()=>{t.frame.isLoad=!0,t.frame.contentWindow.postMessage(e,"*"),t.onloader()}))}this.bridge.top.postMessage(e,"*")}survey(t){this.onloader=t}}t((()=>(window.postBridge=e,e)))}();