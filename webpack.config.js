
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/entry.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        port: '8330',
        historyApiFallback: true,
        inline: true,
        hot: true
    },
    resolve: {
        extensions: [' ', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            { 
                test: /(.js|.jsx)$/,
                loader: 'babel-loader'
            }, {
                test: /(.css|.less)$/,
                use: [
                    { 
                        loader: 'style-loader' 
                    }, { 
                        loader: 'css-loader' 
                    }, { 
                        loader: 'less-loader' 
                    }, { 
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                autoprefixer({
                                    browsers: [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' ],
                                    flexbox: 'no-2009'
                                }),
                                pxtorem({ rootValue: 100, propWhiteList: [] })
                            ]
                        }
                    }
                ]
            }, {
                test: /(.jpg|.jpeg|.png|.gif)$/,
                loader: 'url-loader?limit=8192&name=./src/assets/images/[hash:8].[ext]'
            }, {
                test : /\.(mp3)(\?.*)?$/,
                loader : 'url-loader',
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究~'),
        new HtmlWebpackPlugin({
            template: __dirname + '/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
}