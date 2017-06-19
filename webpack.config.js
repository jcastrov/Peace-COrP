const path = require("path");

const setup = {
  "context": path.join(__dirname, "src/js/dev"),
  "entry": "./main_final.js",
  "module": { "loaders": [] },
  "output": {
    "filename": "main.min.js",
    "path": path.resolve(__dirname, "dist")
  }
};

// =============================================================================
// Advanced configuration
// =============================================================================
const config = require("./config");
const debug = config.nodeEnv !== "production";

setup.devtool = false;
if (debug) {
  // For Google Chrome: "inline-sourcemap"
  setup.devtool = "inline-sourcemap";
}

// =============================================================================
// React
// =============================================================================
setup.module.loaders.push({
  "exclude": /(node_modules|bower_components)/,
  "loader": "babel-loader",
  "test": /\.jsx?/
});

// =============================================================================
// Export
// =============================================================================
module.exports = setup;


// "module": {
//     "loaders": [{
//         "exclude": /(node_modules|bower_components)/,
//         "loader": "babel-loader",
//         "query": {
//             "plugins": ["react-html-attrs",
//                  transform-decorators-legacy", "transform-class-properties"],
//             "presets": ["react", "es2015", "stage-0"]
//         },
//         "test": /\.jsx?$/
//     }]
// },


// const webpack = require("webpack");
// devServer: {
//     contentBase: __dirname,
//     compress: true,
//     port: 9000
// }
// setup.plugins = debug
//         ? []
//         : [new webpack.optimize.UglifyJsPlugin({
//             "mangle": false,
//             "sourcemap": false
//         })];
