const DeclarationBundlerPlugin = require("declaration-bundler-webpack-plugin");
module.exports = {
  parallel: false,
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
    // plugins: [
    //   new DeclarationBundlerPlugin({
    //     moduleName: "elementui3",
    //     out: "./element.d.ts",
    //   }),
    // ],
  },
  chainWebpack: (config) => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .loader("ts-loader")
      .tap((opts) => {
        opts.transpileOnly = false;
        opts.happyPackMode = false;
        opts.para;
        return opts;
      });
    config.module.rule("ts").uses.delete("cache-loader");
    config.module.rule("tsx").uses.delete("cache-loader");
  },
};
