var path = require("path");

module.exports = {
    mode: "development",
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [ path.join(__dirname, "src"), "node_modules" ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            "presets": [
                                "env",
                                "babel-preset-power-assert"
                            ],
                            "plugins": [
                                "transform-vue-jsx"
                            ]
                        }
                    },
                    "ts-loader"
                ],
                exclude: /node_modules/
            }
        ]
    }
};

module.exports.externals = [require('webpack-node-externals')()];
