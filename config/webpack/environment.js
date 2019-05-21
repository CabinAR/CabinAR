const { environment } = require('@rails/webpacker')


const babelLoader = environment.loaders.get('babel')
console.log(babelLoader)
babelLoader.exclude = /node_modules/


module.exports = environment