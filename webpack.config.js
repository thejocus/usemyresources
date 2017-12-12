
'use strict';

const Config = require(`${__dirname}/package.json`);

module.exports = {
    entry: {
        'app' : `${__dirname}${Config.paths.tsPath}/app.ts`
    },

    output: {
        path: `${__dirname}${Config.paths.jsPath}`,
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            { test: /\.ts$/, use: 'awesome-typescript-loader' }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            `${__dirname}${Config.paths.tsPath}`
        ],
        extensions: ['.ts', '.js']
    },
    devtool: false
};