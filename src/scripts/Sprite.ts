import { Resources } from "./Resources";

interface ISpriteParams {
    url: string,
    pos: [number, number],
    size: [number, number] | number
}

export class Sprite {
	public img: HTMLImageElement;
	private _params: ISpriteParams;

	constructor(params: ISpriteParams) {
		this._params = params;
		this.loadImage();
    }

    public update(): void {

    }

    public render(): void {

    }

	private async loadImage() {
		this.img = await Resources.loadImage(this._params.url);
	}
}