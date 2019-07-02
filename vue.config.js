const path = require('path');
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
}