const path = require('path');

const config = {
    context: __dirname,
    entry: './js/App.jsx',
    devServer: {
        publicPath: '/dist/',
        historyApiFallback: true
    },
    devtool: 'cheap-eval-source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'codearena.bundle.js'
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
            }
        ]
    }
};

module.exports = config;