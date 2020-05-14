const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
module.exports = {
    publicPath: "yuzu-def-ui",
    outputDir: path.resolve(__dirname, "./dist/yuzu-def-ui"),
    chainWebpack: config => {
        config.plugin('copy').tap((args) => [[{
            from: './public/yuzu-def-ui/overlay.css',
            to: './overlay.css',
        },
        {
            from: './public/yuzu-def-ui/websocketClient.js',
            to: './websocketClient.js',
        }]]
        );
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    PACKAGE_VERSION: '"' + version + '"'
                }
            })
        ]
    },
}