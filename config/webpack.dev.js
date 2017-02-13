const variables = require("./var");

module.exports = require("./tools").extendConfig({
	output: {
		filename: "[name].js"
	},

	devtool: "source-map",
	watch: true
});