const path = require('path');
const appFolder = "../app";
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@frontend/app": path.resolve(__dirname, appFolder)
      }
    }
  }
};
