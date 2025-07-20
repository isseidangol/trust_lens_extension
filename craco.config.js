const path = require('path');

module.exports = {
  webpack: {
    configure: config => {
      config.entry = {
        main: path.resolve(__dirname, 'src/index.js'),
        background: path.resolve(__dirname, 'src/background.js'),
        contentScript: path.resolve(__dirname, 'src/contentScript.js'),
      };
      config.output.filename = 'static/js/[name].js';
      return config;
    }
  }
};
