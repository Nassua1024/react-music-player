
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const htmlWebpackPlugin = require('html-webpack-plugin');
const zipPlugin = require('webpack-zip-files-plugin');
const uglifyJs = require('uglifyjs-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin'); 
const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/entry.js',
    output: {
        path: __dirname + '/dist/tmp',
        filename: 'bundle-[hash].js',
        publicPath: '/dist/tmp/'        
    },
    devtool: '',
    devServer: {
        contentBase: './',
        port: '8030',
        inline: true,
        historyApiFallback: true
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
                                // pxtorem({ rootValue: 100, propWhiteList: [] }) // px => rem
                            ]
                        }
                    }
                ]
            }, {
                test: /(.jpg|.jpeg|.png|.gif)$/,
                loader: 'url-loader?limit=8192&name=./src/assets/images/[hash:8].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究~'),
        new htmlWebpackPlugin({
            filename: __dirname + '/dist/index.html',
            template: __dirname + '/index.html'
        }),
        new uglifyJs(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({ 
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'base_api': JSON.stringify('')
            }
        }),
        new zipPlugin({
            entries: [
                {src: path.join(__dirname, './dist/tmp'), dist: 'tmp'},
                {src: path.join(__dirname, './dist/index.html'), dist: 'index.html'}
            ],
            output: path.join(__dirname, './dist'),
            format: 'zip',
        }),
        new cleanWebpackPlugin(
            ['dist', 'dist.zip'],
            { root: __dirname, verbose: true, dry: false }
        )
    ]
}