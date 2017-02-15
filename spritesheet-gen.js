const fs = require("fs"),
	path = require("path"),
	frameRegex = /^(.+?)_(\d+)\.\w+$/,
	spritesheet = require("spritesheet-js"),
	options = {
		format: "json",
		trim: true,
		path: "./assets"
	};


spritesheet(path.resolve("./assets/sprites/*.png"), options, function (err) {
	if (err) throw err;
	const data = require("./assets/spritesheet.json"),
		formattedData = {
			frames: {},
			animations: {}
		},
		{ frames, animations } = formattedData;


	for (let key in data.frames) {
		const titleParts = key.trim().match(frameRegex),
			name = titleParts[1] + (titleParts[2] ? `_${titleParts[2]}` : "");

		frames[name] = data.frames[key].frame;

		if(titleParts[2]) {
			const animation = animations[titleParts[1]] || (animations[titleParts[1]] = []);
			animation.push({
				index: +titleParts[2],
				name
			});
		}
	}

	for(let key in animations) {
		animations[key] = animations[key].sort((a, b) => {
			return a.index > b.index;
		}).map((animation) => {
			return animation.name
		});
	}

	fs.writeFile("./assets/spritesheet.json", JSON.stringify(formattedData, null, 2), (err) => {
		if(err) throw err;
		console.log("Spritesheet successfully generated.");
	})
});