const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  productionSourceMap: false,
  lintOnSave: false,

  css: {
    sourceMap: !isProd
  },

  configureWebpack: config => {
    if (isProd) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          // amcharts4 тянет pdfmake/xlsx для экспорта графиков в отдельный
          // async-чанк — без этого правила сам amcharts4 дублируется
          // между основным вендор-бандлом и этим чанком
          amcharts: {
            test: /[\\/]node_modules[\\/]@amcharts[\\/]/,
            name: 'vendor-amcharts',
            priority: 20,
            reuseExistingChunk: true
          },
          pdfmake: {
            test: /[\\/]node_modules[\\/]pdfmake[\\/]/,
            name: 'vendor-pdfmake',
            priority: 20,
            reuseExistingChunk: true
          },
          xlsx: {
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            name: 'vendor-xlsx',
            priority: 20,
            reuseExistingChunk: true
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
