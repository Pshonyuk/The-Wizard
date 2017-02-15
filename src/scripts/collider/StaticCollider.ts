import { RenderPlatform } from "../RenderPlatform";
import { Sprite } from "../sprite";

export class StaticCollider {
	constructor(public sprites: Sprite[]) {
	}

	update(rp: RenderPlatform): void {
		this.sprites.forEach((sprite: Sprite) => {
			sprite.update(rp);
		})
	}
}