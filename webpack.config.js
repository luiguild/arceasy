const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        browser: './index.js'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'arceasy.min.js',
        sourceMapFilename: '[file].map',
        libraryTarget: 'commonjs-module'
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
