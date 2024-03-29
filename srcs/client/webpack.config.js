const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        app: path.resolve(__dirname, './srcs/App.js'),
        styles: path.resolve(__dirname, './srcs/styles/style.scss'),
    },
    mode: "production",
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, './public'),
    },
    devServer: {
        static: './public',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {    
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.css', '.scss'],
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new Dotenv(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                format: {
                    comments: /@license|@preserve|^!/i,
                },
            },
            extractComments: false,
        })],
    },
};
