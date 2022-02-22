const { merge } = require('webpack-merge');
const commonConfig = require('./common');

const config = {
    mode: 'production',

    optimization: {
        emitOnErrors: true,
    },
};

module.exports = merge(commonConfig, config);
