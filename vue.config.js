const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  transpileDependencies: [
    "chord-fingering",
  ], 
  
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",

  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_imports.scss";
        `
      }
    }
  },

  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader')
      .tap(opts => ({ ...opts, emitWarning: true }));
    config.resolve.symlinks(false);
    config.resolve.alias
      .set('@@', resolve(''));

    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({});
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
};
