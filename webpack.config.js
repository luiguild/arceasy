const UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    path = require('path'),
    config = {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'arceasy.js',
            sourceMapFilename: '[file].map'
        },
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
        },
        plugins: [
            new UglifyJSPlugin({
                compress: false,
                comments: false,
                sourceMap: true
            })
        ]
    }

module.exports = config
