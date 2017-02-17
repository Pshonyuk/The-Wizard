import { RenderPlatform } from "../render-platform";
import { SpriteSheet } from "./SpriteSheet";


interface ISpriteParams {
	spriteSheet: SpriteSheet
	frames: string[] | string
	loop?: boolean,
	scale?: number,
	speed?: number,
	position?: {x: number, y: number}
}


export class Sprite {
	static get defaults(): ISpriteParams {
		return {
			spriteSheet: null,
			frames: null,
			loop: true,
			speed: 10,
			scale: 1,
			position: { x: 0, y: 0 }
		}
	}

	private _params: ISpriteParams;
	private _offset: number;
	private _endAnimation: boolean;


	constructor(params: ISpriteParams) {
		this._params = { ...Sprite.defaults, ...params };
		this._offset = 0;
	}

	public get spriteSheet(): SpriteSheet {
		return this._params.spriteSheet;
	}

	public get frames(): string[] {
		const frames = this._params.frames;
		return Array.isArray(frames) ? frames.slice(0) : [frames];
	}

	public get loop(): boolean {
		return this._params.loop;
	}

	public get speed(): number {
		return this._params.speed;
	}

	public get offset(): number {
		return Math.floor(this._offset) % this.frames.length;
	}

	public get activeFrame() {
		return this.spriteSheet.frames[this.frames[this.offset]];
	}

	public update(dt: number): void {
		const frames = this.frames;

		if (frames.length && !this._endAnimation) {
			this._offset += dt * this.speed;

			if (this.offset >= frames.length) {
				this._endAnimation = this.loop ? false : true;
			}
		}
	}

	public render(rp: RenderPlatform): void {
		const spriteSheet = this.spriteSheet,
			frame = this.activeFrame;

		rp.drawImage(
			spriteSheet.img,
			frame.x,
			frame.y,
			frame.w,
			frame.h,
			0, 0,
			frame.w,
			frame.h
		);
	}
}