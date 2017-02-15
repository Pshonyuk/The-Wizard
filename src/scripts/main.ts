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
	colliders: StaticCollider[] = [],
	characterSH = new SpriteSheet({
		url: "./assets/sprites/",
		name: "character"
	}),
	tilesetSH = new SpriteSheet({
		url: "./assets/sprites/",
		name: "tileset"
	});

el.width = window.document.body.clientWidth;
el.height = window.document.body.clientHeight;

function getBottomY(frame, pos, scale = 1): number {
	return el.height - pos - frame.h * scale;
}

function createGameObjects() {
	gameObjects.push(...[
		new StaticCollider([
			new Sprite({
				spriteSheet: tilesetSH,
				frames: "tree2",
				scale: 2,
				position: { x: 700, y: getBottomY(tilesetSH.frames["tree2"], 100, 2) }
			})
		]),
		new Sprite({
			spriteSheet: characterSH,
			speed: 8,
			position: { x: 0, y: getBottomY(characterSH.frames[characterSH.animations["run"][0]], 40) },
			frames: characterSH.animations["run"]
		}),
		new StaticCollider([
			new Sprite({
				spriteSheet: tilesetSH,
				frames: "tree3",
				scale: 3,
				position: { x: 0, y: getBottomY(tilesetSH.frames["tree3"], 0, 3) }
			})
		])
	]);
}

function render() {
	renderPlatform.clear();
	map.render();

	gameObjects.forEach((gameObject: (Sprite| StaticCollider), i: number) => {
		if (gameObject instanceof Sprite) {
			gameObject.moveX(7);
			if (gameObject.position.x > el.width) {
				gameObject.moveX(-el.width - gameObject.activeFrame.w);
			}
		}

		gameObject.update(renderPlatform);
	});

	requestAnimationFrame(render);
}


Resources.stopSession();
Resources.onLoad().then((data) => {
	createGameObjects();
	render();
}).catch((err) => {
	console.error(err);
});

