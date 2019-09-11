const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    output: {
        path: __dirname + '/static'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
            // },
            // {
            //     test: /\.(jpeg|png|svg|jpg|gif)$/,
            //     use: [
            //         {
            //             loader: 'file-loader'
            //         }
            //     ]
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "../templates/index.html"
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/img',
                to: 'img'
            }
        ])
    ]
};