const path = require('path');
const WebpackBar = require('webpackbar');
const rootDir = path.resolve(__dirname, '../../');

module.exports = {
    target: 'node',

    entry: './src/index.ts',

    output: {
        path: path.resolve(rootDir, './dist'),
        filename: 'index.js',
        library: 'rds-client',
        umdNamedDefine: true,
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/,
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    plugins: [
        new WebpackBar({
            reporter: ['fancy'],
            name: 'Rds Client',
            color: '#f60cd7',
        }),
    ],
};
