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
				test: /\.scss$/,
				loaders: ["style", "css", "sass"],
				exclude: ["/node_modules/"]
			},
			{
				test: /\.glsl$/,
				loader: "includes",
				exclude: ["/node_modules/"]
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
	},
	includes: {
		extensions: function (filepath) {
			let extensions;
			if (/\.html$/.test(filepath)) {
				extensions = ['', '.html', '.shtml', '.htm'];
			} else if (/\.glsl$/.test(filepath)) {
				extensions = ['', '.glsl', '.vert', '.frag'];
			}
			return extensions;
		},
		pattern: function (filepath) {
			let pattern;
			// only custom includes pattern for html
			if (/\.html$/.test(filepath)) {
				pattern = {
					re: /<!--#\s*?include\s+?virtual=("|')(.+?)\1\s*?-->/,
					index: 2
				};
			}
			return pattern;
		}
	}
});