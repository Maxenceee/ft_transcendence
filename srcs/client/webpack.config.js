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
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				]
			}
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
