/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

const cdnDependencies = require('./dependencies-cdn');

const cdn = {
  css: cdnDependencies.map((e) => e.css).filter((e) => e),
  js: cdnDependencies.map((e) => e.js).filter((e) => e),
};

class BuildAppJSPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'BuildAppJSPlugin',
      (compilation, callback) => {
        let cssarr = [];
        const jsarr = [];
        for (let filename in compilation.assets) {
          if (filename.match('.*\\.js$')) {
            if (process.env.NODE_ENV === 'production') {
              filename = (process.env.VUE_APP_CDN_PATH || '/') + filename;
            } else {
              filename = `/${filename}`;
            }
            jsarr.push(filename);
          }
          if (filename.match('.*\\.css$')) {
            cssarr.push(filename);
          }
        }
        cssarr = cssarr.sort((a) => a.indexOf('app.'));
        let cdnjs = '';
        if (process.env.NODE_ENV === 'production') {
          cssarr = cdn.css.concat(cssarr);
          cdnjs = `var cdnjs = ${JSON.stringify(cdn.js)};
          cdnjs.forEach((item) => {
            document.write('<script src="' + item + '"></script>');
          });`;
        } else {
          cssarr = cssarr.concat(
            cdnDependencies.filter((e) => e.name === '').map((e) => e.css),
          );
        }
        const content = `
          var scripts = ${JSON.stringify(jsarr)};
          ${cdnjs}
          scripts.forEach((item) => {
            document.write('<script src="' + item + '"></script>');
          });
        `;
        let cssContent = '';
        cssarr.forEach((item) => {
          cssContent += `@import url(${item});\n`;
        });
        compilation.assets['app.js'] = {
          source() {
            return content;
          },
          size() {
            return jsarr.length;
          },
        };

        compilation.assets['style.css'] = {
          source() {
            return cssContent;
          },
          size() {
            return cssarr.length;
          },
        };

        callback();
      },
    );
  }
}

module.exports = BuildAppJSPlugin;
