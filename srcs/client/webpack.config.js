const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: './srcs/App.js',
	mode: "production",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/javascripts'),
    },
	devServer: {
		static: './public/javascripts',
	},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				]
			},
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                exclude: /\/static\/fonts\//,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: /\/static\/fonts\//,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
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
