"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var webpack_1 = __importDefault(require("webpack"));
var react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
var mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
var isDevelopment = mode === 'development';
var conf = {
    mode: mode,
    entry: ['webpack-hot-middleware/client', './src/server-app/index.tsx'],
    output: {
        filename: 'bundle.js',
        path: path_1["default"].resolve(__dirname, 'src', 'server', 'public'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            'react-native-sqlite-storage': false,
            path: false,
            fs: false
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.csv$/,
                type: 'asset/source'
            },
        ]
    },
    devtool: 'source-map',
    plugins: [
        isDevelopment && new webpack_1["default"].HotModuleReplacementPlugin(),
        isDevelopment && new react_refresh_webpack_plugin_1["default"](),
    ].filter(Boolean)
};
exports["default"] = conf;
