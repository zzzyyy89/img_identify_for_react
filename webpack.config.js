const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const webpack=require('webpack');
const autoprefixer=require('autoprefixer');
const ExtractTextPlugin=require('extract-text-webpack-plugin');
module.exports={
    entry: ['babel-polyfill','./App.js'],
    output:{
        pathinfo:true,
        filename: 'bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/'
    },
    devtool:'cheap-module-source-map',
    devServer:{
        contentBase:path.resolve(__dirname,'lib'),
        inline:true,
        hot:true,
        port:3030
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['env','react']
                    }
                }
            },{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader",{
                        loader:'postcss-loader',
                        options:{
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        }
                    }]
                })
            },{
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        'limit': 10000,
                        outputPath: 'images/',
                    }
                }]
            }
        ]
    },
    plugins:[
        new ExtractTextPlugin('css/index.css'),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}