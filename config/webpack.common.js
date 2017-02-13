const variables = require("./var"),
	tools = require("./tools");

module.exports = tools.extendConfig({
	entry: variables.get("entryPoints"),
	output: {
		path: tools.getPath("/build")
	},

	resolve: {
		extensions: ["", ".ts", ".js"]
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: "ts",
				exclude: ["/node_modules/"]
			},
			{
				test: /\.json$/,
				loader: "json",
				exclude: ["/node_modules/"]
			},
			{
				// include: [ tools.getPath("src/styles") ],
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			}
			// {
			// 	test: /\.scss$/,
			// 	loader: "style!css!sass!resolve-url!sass?sourceMap",
			// 	exclude: ["/node_modules/"]
			// },
			// {
			// 	test: /\.css$/,
			// 	loader: "style-loader!css-loader",
			// 	exclude: ["/node_modules/"]
			// },
			// {
			// 	test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			// 	loader: "url-loader?limit=1,0000&mimetype=application/font-woff",
			// 	exclude: ["/node_modules/"]
			// },
			// {
			// 	test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			// 	loader: "file-loader",
			// 	exclude: ["/node_modules/"]
			// }
		]
	}
});