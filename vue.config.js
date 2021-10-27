const production = true

module.exports = {
  publicPath: production === true ? '' : '/',
  productionSourceMap: false,
  assetsDir: "assets",
};
