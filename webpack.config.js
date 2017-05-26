const path = require('path'),
    config = {
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'esrijs.js'
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
                                {
                                    modules: false,
                                    comments: false,
                                    minified: true
                                }
                            ]
                        ]
                    }
                }]
            }]
        }
    }

module.exports = config
