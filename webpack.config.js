//const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	entry:'./www/app.jsx',
	output: {
		path: __dirname,
		filename: './www/bundle.js',
	},
	resolve: {
		extensions: ['.js','.jsx','.css']
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['react','es2015']
				},
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /(\.scss|\.css)$/,
				loaders: [
				  require.resolve('style-loader'),
				  require.resolve('css-loader') + '?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
				  require.resolve('sass-loader') + '?sourceMap'
				]
			},
		]
	}
};