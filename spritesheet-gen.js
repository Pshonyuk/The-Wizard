const fs = require("fs"),
	path = require("path"),
	frameRegex = /^(.+?)(?:[_\-]+(\d*))?\.\w+$/,
	spritesheet = require("spritesheet-js"),
	base = "./assets/sprites/";


function generateSpriteSheet(shName) {
	const globalPath = path.resolve(`${base}${shName}`),
		options = {
			name: shName,
			format: "json",
			trim: true,
			padding: 1,
			path: base
		};

	{
		let err;
		try {
			const meta = require(path.join(globalPath, "meta.json"));
			Object.assign(options, meta);
		} catch (err) {
		}
	}

	spritesheet(path.join(`${globalPath}/*.png`), options, function (err) {
		if (err) throw err;
		const data = require(`${base}${shName}.json`),
			formattedData = {
				frames: {},
				animations: {}
			},
			{frames, animations} = formattedData;


		for (let key in data.frames) {
			const titleParts = key.trim().toLowerCase().match(frameRegex),
				name = titleParts[1] + (titleParts[2] ? `_${+titleParts[2]}` : "");

			frames[name] = data.frames[key].frame;

			if (titleParts[2]) {
				const animation = animations[titleParts[1]] || (animations[titleParts[1]] = []);
				animation.push({
					index: +titleParts[2],
					name
				});
			}
		}

		for (let key in animations) {
			animations[key] = animations[key].sort((a, b) => {
				return a.index > b.index;
			}).map((animation) => {
				return animation.name
			});
		}

		fs.writeFile(`${base}${shName}.json`, JSON.stringify(formattedData, null, 2), (err) => {
			if (err) throw err;
			console.log(`Spritesheet "${shName}" successfully generated.`);
		})
	});
}


fs.readdir(base, (err, list) => {
	if (err) throw err;

	list.forEach(item => {
		fs.stat(path.resolve(`${base}${item}`), (err, stat) => {
			if (err) throw err;
			if (stat.isDirectory()) generateSpriteSheet(item);
		});
	});
});
