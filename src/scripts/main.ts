require("../styles/main.scss");
import { RenderPlatform } from "./RenderPlatform";
import { Resources } from "./Resources";
import { Sprite, SpriteSheet } from "./sprite/";
import { Map } from "./Map";

Resources.startSession();
const el = <HTMLCanvasElement>document.getElementById("game-view-port"),
	renderPlatform = new RenderPlatform(el),
	map = new Map(),
	sprites: Sprite[] = [],
	spriteSheet = new SpriteSheet({
		url: "./assets/",
		name: "spritesheet"
	});

el.width = window.document.body.clientWidth;
el.height = window.document.body.clientHeight;

function createSprites() {
	sprites.push(new Sprite({
		spriteSheet,
		speed: 6,
		frames: spriteSheet.animations["walk"]
	}));
	sprites.push(new Sprite({
		spriteSheet,
		speed: 4,
		position: {y: 400, x: 0},
		frames: spriteSheet.animations["jump"]
	}));
}

function render() {
	renderPlatform.clear();
	map.render();
	sprites.forEach(sprite => sprite.update(renderPlatform));
	requestAnimationFrame(render);
}


Resources.stopSession();
Resources.onLoad().then((data) => {
	createSprites();
	render();
}).catch((err) => {

});

