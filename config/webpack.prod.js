var webpack = require("webpack"),
	variables = require("./var");

module.exports = require("./tools").extendConfig({
	output: {
		filename: "[name].min.js"
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
});