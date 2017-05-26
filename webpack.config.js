const webpack = require('webpack'),
    path = require('path'),
    config = {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'esrijs.js'
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                include: /\.min\.js$/,
                minimize: true,
                mangle: false,
                sourcemap: true,
                compress: {
                    warnings: false
                }
            })
        ],
        module: {
            rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                'es2015',
                                'stage-2'
                            ]
                        ]
                    }
                }]
            }]
        }
    }

module.exports = config
