require("../styles/main.scss");
import { RenderPlatform } from "./render-platform";
import { Resources } from "./Resources";
import { Sprite, SpriteSheet } from "./sprite/";
import { BasicCollider } from "./collider";
import { Map } from "./Map";

Resources.startSession();
const el = <HTMLCanvasElement>document.getElementById("game-view-port"),
	renderPlatform = new RenderPlatform(el),
	map = new Map(),
	gameObjects: (Sprite|BasicCollider)[] = [],
	characterSH = new SpriteSheet({
		url: "./assets/sprites/",
		name: "character"
	}),
	tilesetSH = new SpriteSheet({
		url: "./assets/sprites/",
		name: "tileset"
	});

el.width = Math.round(window.document.body.clientWidth / 2);
el.height = Math.round(window.document.body.clientHeight / 2);

function createGameObjects() {
	gameObjects.push(...[
		new BasicCollider({
			scale: 0.5,
			sprites: [
				new Sprite({
					spriteSheet: tilesetSH,
					frames: tilesetSH.animations["flame"],
					position: { x: 400, y: 0 }
				})
			]
		})
	]);
}

let time: number;
function render() {
	const deltaTime = (Date.now() - time) / 1000;

	renderPlatform.clear();
	map.render();

	gameObjects.forEach((gameObject: (Sprite| BasicCollider), i: number) => {
		gameObject.update(deltaTime);
		gameObject.render(renderPlatform);
	});

	time = Date.now();
	requestAnimationFrame(render);
}


Resources.stopSession();
Resources.onLoad().then((data) => {
	createGameObjects();
	time = Date.now();
	render();
}).catch((err) => {
	console.error(err);
});