const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/chordline/" : "/",

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
