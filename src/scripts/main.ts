import { Resources } from "./Resources";
import { Sprite } from "./Sprite";

Resources.startSession();

const sprite = new Sprite({
	url: "./assets/sprites.png",
	pos: [0, 0],
	size: 40
});

function render() {
	sprite.update();
	requestAnimationFrame(render);
}

Resources.stopSession();
Resources.onLoad().then((data) => {
	render();
}).catch((err) => {

});

