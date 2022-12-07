const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
	mode,
	entry: './src/extension/content-script.ts',
	output: {
		filename: 'content-script.js',
		path: path.resolve(__dirname, 'dist', 'extension'),
	},
	resolve: {
		extensions: ['.ts', '.tsx'],
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
};
