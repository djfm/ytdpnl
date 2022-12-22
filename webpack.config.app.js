const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

module.exports = {
	mode,
	entry: './src/server/app/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'src', 'server', 'public'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	devtool: 'source-map',
};
