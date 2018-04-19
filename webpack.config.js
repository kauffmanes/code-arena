const path = require('path');

const config = {
    context: __dirname,
    entry: './js/App.jsx',
    devServer: {
        publicPath: '/public/',
        historyApiFallback: true
    },
    devtool: 'cheap-eval-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    stats: {
        colors: true,
        reasons: true,
        chunks: false
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }, {
                test: /\.css$/,
                loader: 'style-loader'
            }, {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            }
        ]
    }
};

module.exports = config;