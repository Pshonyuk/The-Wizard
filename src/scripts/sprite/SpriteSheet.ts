import { Resources } from "../Resources";


type SpriteFrame = {
	x: number,
	y: number,
	w: number,
	h: number
};

type SpriteAnimation = string[];

interface ISpriteSheetParams {
	name: string,
	url: string
}

interface ISpriteSheetMeta {
	frames: {
		[key: string]: SpriteFrame
	},
	animations: {
		[key: string]: SpriteAnimation
	}
}


export class SpriteSheet {
	public img: HTMLImageElement;
	public json: ISpriteSheetMeta;
	private _params: ISpriteSheetParams;

	constructor(params: ISpriteSheetParams) {
		this._params = (<any>Object).assign({}, params);
		this._loadImage();
		this._loadJson();
	}

	public get frames(): {[key: string]: SpriteFrame} {
		return this.json.frames;
	}

	public get animations(): {[key: string]: SpriteAnimation} {
		return this.json.animations;
	}

	private async _loadImage() {
		const params = this._params;
		this.img = await Resources.loadImage(`${params.url}${params.name}.png`);
	}

	private async _loadJson() {
		const params = this._params;
		this.json = await Resources.loadJson(`${params.url}${params.name}.json`);
	}
}