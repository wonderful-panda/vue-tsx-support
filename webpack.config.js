var path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    entry: "./index.ts",
    output: {
        library: "vue-tsx-support",
        libraryTarget: "umd",
        path: path.join(__dirname, "lib"),
        filename: "index.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts"],
        modules: [ path.join(__dirname, "src"), "node_modules" ]
    },
    module: {
        loaders: [
          { test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ }
        ]
    },
    externals: [
        "vue"
    ]
};
