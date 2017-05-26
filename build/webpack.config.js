const path = require('path'),
    config = {
        entry: './path/to/my/entry/file.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'my-first-webpack.bundle.js'
        },
        module: {
            rules: [
                {test: /\.(js|jsx)$/, use: 'babel-loader'}
            ]
        }
    }

module.exports = config
