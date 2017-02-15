require("../styles/main.scss");
import { RenderPlatform } from "./RenderPlatform";
import { Resources } from "./Resources";
import { Sprite, SpriteSheet } from "./sprite/";
import { StaticCollider } from "./collider";
import { Map } from "./Map";

Resources.startSession();
const el = <HTMLCanvasElement>document.getElementById("game-view-port"),
	renderPlatform = new RenderPlatform(el),
	map = new Map(),
	gameObjects: (Sprite|StaticCollider)[] = [],
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

function getBottomY(frame, pos, scale = 1): number {
	return el.height - pos - frame.h * scale;
}

function createGameObjects() {
	gameObjects.push(...[
		new StaticCollider([
			new Sprite({
				spriteSheet: tilesetSH,
				frames: "tree2",
				position: { x: 400, y: getBottomY(tilesetSH.frames["tree2"], 100) }
			})
		]),
		new Sprite({
			spriteSheet: characterSH,
			speed: 9,
			scale: 0.5,
			position: { x: 0, y: getBottomY(characterSH.frames[characterSH.animations["run"][0]], 40, 0.5) },
			frames: characterSH.animations["run"]
		}),
		new StaticCollider([
			new Sprite({
				spriteSheet: tilesetSH,
				frames: "tree3",
				scale: 1.5,
				position: { x: 0, y: getBottomY(tilesetSH.frames["tree3"], 0, 1.5) }
			})
		])
	]);
}

let time: number;
function render() {
	const deltaTime = Date.now(),
		speed = 368;
	renderPlatform.clear();
	map.render();

	gameObjects.forEach((gameObject: (Sprite| StaticCollider), i: number) => {
		if (gameObject instanceof Sprite) {
			gameObject.moveX(Math.floor((speed * (deltaTime - time)) / 1000));
			if (gameObject.position.x > el.width) {
				gameObject.moveX(-el.width - gameObject.activeFrame.w);
			}
		}

		gameObject.update(renderPlatform);
	});

	time = deltaTime;
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

