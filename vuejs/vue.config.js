const path = require("path");
const cdnDependencies = require("./dependencies-cdn");
const BuildAppJSPlugin = require("./buildAppJSPlugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// Increase environment variables
process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_G2INDEX_VERSION = require("./package.json").g2index;

process.env.VUE_APP_CDN_PATH =
  process.env.VUE_APP_CDN_PATH.replace(
    "@master",
    "@v" + process.env.VUE_APP_VERSION
  ).replace("THEME", process.env.VUE_APP_THEME) || "/";

// Basic path Note that you need to modify this before publishing
let publicPath = process.env.VUE_APP_CDN_PATH || "/";
let cdnPath = process.env.VUE_APP_CDN_PATH;
const isProd = process.env.NODE_ENV === "production";

//Set the library not to participate in the build
let externals = {};
cdnDependencies.forEach((item) => {
  externals[item.name] = item.library;
});

// import file cdn link
const cdn = {
  css: cdnDependencies.map((e) => e.css).filter((e) => e),
  js: cdnDependencies.map((e) => e.js).filter((e) => e),
};
module.exports = {
  publicPath,
  lintOnSave: true,
  css: {
    loaderOptions: {

      // Set scss public variable file
      sass: {
        prependData: `$cdnPath: "${isProd ? cdnPath : "/"}";`,
      },
    },
  },
  configureWebpack: (config) => {
    const configNew = {};
    if (isProd) {
      configNew.externals = externals;
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
        new JavaScriptObfuscator({
            compact: true,
            disableConsoleOutput: true,
            rotateStringArray: true,
            shuffleStringArray: true,
        }, ['app.js']),
      ];
    }
    return configNew;
  },

  chainWebpack: (config) => {
    config.plugin("BuildAppJSPlugin").use(BuildAppJSPlugin);
    /**
      * Add CDN parameter to htmlWebpackPlugin configuration
      */
    config.plugin("html").tap((args) => {
      if (isProd) {
        args[0].cdn = cdn;
      } else {
        args[0].cdn = {
          js: cdnDependencies.filter((e) => e.name === "").map((e) => e.js),
          css: cdnDependencies.filter((e) => e.name === "").map((e) => e.css),
        };
      }
      args[0].inject = false;
      return args;
    });
    // Solve the cli3 hot update failure https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true);
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@utils", resolve("src/utils"))
      .set("@api", resolve("src/api"))
      .set("@node_modules", resolve("node_modules"));

    // analyzing tool
    if (process.env.npm_config_report) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  },

// Do not output map file
  productionSourceMap: false,

  devServer: {
    publicPath,
    proxy: {
      "/api": {
        target: "https://glorytoheaven.tk/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
};
