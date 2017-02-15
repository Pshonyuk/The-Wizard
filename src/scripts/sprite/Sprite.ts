import { RenderPlatform } from "../RenderPlatform";
import { SpriteSheet } from "./SpriteSheet";


interface ISpriteParams {
	spriteSheet: SpriteSheet
	frames: string[] | string
	loop?: boolean,
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
			position: { x: 0, y: 0 }
		}
	}

	private _params: ISpriteParams;
	private _offset: number;
	private _time: number;
	private _endAnimation: boolean;
	private _position: {x: number, y: number};

	constructor(params: ISpriteParams) {
		this._params = (<any>Object).assign(Sprite.defaults, params);
		this._position = { ...this._params.position };
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

	public get position(): {x: number, y: number} {
		return { ...this._position };
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

	public update(rp: RenderPlatform): void {
		const frames = this.frames;

		if (frames.length && !this._endAnimation) {
			const deltaTime: number = Date.now();

			if (this._time) {
				this._offset += (this.speed / 1000) * (deltaTime - this._time);
				if (this._offset >= frames.length) {
					this._endAnimation = this.loop ? false : true;
					this._offset = 0;
				}
			}
			this._time = deltaTime;
		}

		this.render(rp);
	}

	public render(rp: RenderPlatform): void {
		const spriteSheet = this.spriteSheet,
			pos = this.position,
			frame = spriteSheet.frames[this.frames[Math.floor(this._offset)]];

		rp.drawImage(spriteSheet.img, frame.x, frame.y, frame.w, frame.h, pos.x, pos.y, frame.w, frame.h);
	}
}