require("../styles/main.scss");
import { RenderPlatform } from "./RenderPlatform";
import { Resources } from "./Resources";
import { Sprite } from "./Sprite";
import { Map } from "./Map";

Resources.startSession();
const el = <HTMLCanvasElement>document.getElementById("game-view-port"),
	renderPlatform = new RenderPlatform(el),
	map = new Map(),
	sprite = new Sprite({
		url: "./assets/sprites.png",
		pos: [0, 0],
		size: [342, 354],
		speed: 6,
		frames: [0, 1, 2, 3]
	});

// el.width = window.document.body.clientWidth;
el.height = window.document.body.clientHeight;

function render() {
	renderPlatform.clear();
	map.render();
	sprite.update(renderPlatform);
	requestAnimationFrame(render);
}


Resources.stopSession();
Resources.onLoad().then((data) => {
	render();
}).catch((err) => {

});

