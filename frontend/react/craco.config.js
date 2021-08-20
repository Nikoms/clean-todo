const path = require(`path`);
const jestNamespaceAliasPlugin = require("./craco-plugin-jest-namespace-alias.js");

module.exports = {
  webpack: {
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
    alias: {
      '@frontend/app': path.resolve(__dirname, '../app/')
    }
  },
  plugins: [
    { plugin: jestNamespaceAliasPlugin }
  ]
};
