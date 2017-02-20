import { RenderPlatform } from "../render-platform";
import { Sprite } from "../sprite";

export type position2D = {x: number, y: number};
interface IStaticColliderParams {
	type?: "static" | "rigidbody",
	scale?: [number, number] | number,
	sprites?: Sprite[],
	position?: position2D
}


export class BasicCollider {
	static get defaults(): IStaticColliderParams {
		return {
			type: "static",
			sprites: [],
			position: { x: 0, y: 0 },
			scale: 1
		}
	}

	private _params: IStaticColliderParams;
	private _position: position2D;


	constructor(params: IStaticColliderParams) {
		this._params = { ...BasicCollider.defaults, ...params };
		this._position = { ...this._params.position };
	}

	public get position(): position2D {
		return { ...this._position };
	}

	public get sprites(): Sprite[] {
		return this._params.sprites.slice(0);
	}

	public get scale(): [number, number] {
		const scale = this._params.scale;
		return Array.isArray(scale) ? <[number, number]>[...scale] : [scale, scale];
	}

	public moveX(deltaX: number): void {
		this._position.x += deltaX;
	}

	public moveY(deltaY: number): void {
		this._position.y += deltaY;
	}

	public move(deltaX: number, deltaY: number): void {
		this.moveX(deltaX);
		this.moveY(deltaY);
	}

	public update(dt: number): void {
		this.sprites.forEach((sprite: Sprite) => {
			sprite.update(dt);
		})
	}

	public render(rp: RenderPlatform): void {
		this.sprites.forEach((sprite: Sprite) => {
			this._renderSprite(rp, sprite);
		})
	}

	public checkCollision() {

	}

	private _renderSprite(rp: RenderPlatform, sprite: Sprite, offset: position2D = { x: 0, y: 0 }): void {
		const scale = this.scale,
			pos = this.position;

		rp.save();
		rp.translate(pos.x + offset.x, pos.y + offset.y);

		if (scale[0] !== scale[1] || scale[0] !== 1) {
			rp.scale(scale[0], scale[1]);
		}

		sprite.render(rp);
		rp.restore();
	}
}