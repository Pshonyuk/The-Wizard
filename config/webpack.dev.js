const variables = require("./var"),
	LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = require("./tools").extendConfig({
	output: {
		filename: "[name].js"
	},

	plugins: [
		new LiveReloadPlugin({
			appendScriptTag: true
		})
	],

	devtool: "source-map",
	watch: true
});