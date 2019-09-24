const path = require("path");

function resolve(target = `./`) {
  return path.resolve(__dirname, target);
}

module.exports = {
  mode: "production",
  entry: {
    minify: resolve(`./index.js`)
  },
  output: {
    path: resolve(),
    filename: `[name].js`
  }
};
