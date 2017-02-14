import { RenderPlatform } from "./RenderPlatform";
import { Resources } from "./Resources";

interface ISpriteParams {
	url: string,
	pos: [number, number],
	size: [number, number] | number,
	loop?: boolean,
	speed?: number,
	frames?: number[]
}

export class Sprite {
	static get defaults(): ISpriteParams {
		return {
			url: null,
			pos: null,
			size: null,
			loop: true,
			speed: 10,
			frames: null
		}
	}

	public img: HTMLImageElement;
	private _params: ISpriteParams;
	private _offset: number;
	private _time: number;

	constructor(params: ISpriteParams) {
		this._params = (<any>Object).assign(Sprite.defaults, params);
		this._offset = 0;
		this._loadImage();
	}

	public update(rp: RenderPlatform): void {
		const deltaTime: number = Date.now();

		if (this._time) {
			this._offset += (this._params.speed / 1000) * (deltaTime - this._time);
			if(this._offset > this._params.frames.length) this._offset = 0;
		}

		this._time = deltaTime;
		this.render(rp);
	}

	public render(rp: RenderPlatform): void {
		const pos = this._params.pos,
			size = this._params.size,
			sx = pos[0],
			sy = pos[1] + Math.floor(this._offset) * size[1];

		rp.drawImage(this.img, sx, sy, size[0], size[1], 0, 0, size[0], size[1]);
	}

	private async _loadImage() {
		this.img = await Resources.loadImage(this._params.url);
	}
}