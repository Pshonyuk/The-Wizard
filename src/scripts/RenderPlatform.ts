class ViewPort {
	private _ctx: CanvasRenderingContext2D;
	private _gl: WebGLRenderingContext;

	constructor(public el: HTMLCanvasElement) {
	}

	get ctx(): CanvasRenderingContext2D {
		return this._ctx || (this._ctx = this.el.getContext("2d"));
	}

	get gl(): WebGLRenderingContext {
		return this._gl;
	}

	get width(): number {
		return this.el.width;
	}

	get height(): number {
		return this.el.height;
	}

	_initWebGL(): void {
		this._gl = null;

		try {
			this._gl = this.el.getContext("webgl") || this.el.getContext("experimental-webgl");
		}
		catch (e) {
		}
	}
}


class CanvasPlatform implements RenderPlatform {
	public viewPort: ViewPort;

	constructor() {
	}

	public drawImage(...args): void {
		const ctx = this.viewPort.ctx;
		ctx.drawImage.apply(ctx, args);
	}

	public clear(): void {
		const viewPort = this.viewPort;
		viewPort.ctx.clearRect(0, 0, viewPort.width, viewPort.height)
	}
}


class WebGLPlatform implements RenderPlatform {
	public viewPort: ViewPort;

	constructor() {
		const gl = this.viewPort.gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	public drawImage(image): void {
		// const gl = this.viewPort.gl,
		// texture = gl.createTexture();

		// gl.bindTexture(gl.TEXTURE_2D, texture);
		// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		// // gl.generateMipmap(gl.TEXTURE_2D);
		// gl.bindTexture(gl.TEXTURE_2D, null);

	}

	public clear(): void {
		const gl = this.viewPort.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	private _initShaders(): void {
		// const gl = this.viewPort.gl,
		// 	fragmentShader = getShader(gl, "shader-fs"),
		// 	vertexShader = getShader(gl, "shader-vs"),
		//
		// shaderProgram = gl.createProgram();
		// gl.attachShader(shaderProgram, vertexShader);
		// gl.attachShader(shaderProgram, fragmentShader);
		// gl.linkProgram(shaderProgram);
		//
		// if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		// 	alert("Unable to initialize the shader program.");
		// }
		//
		// gl.useProgram(shaderProgram);
		//
		// const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		// gl.enableVertexAttribArray(vertexPositionAttribute);
	}
}


export class RenderPlatform {
	public viewPort: ViewPort;

	constructor(el: HTMLCanvasElement) {
		this.viewPort = new ViewPort(el);
		// this.viewPort._initWebGL();

		if (this.viewPort.gl) {
			(<any>Object).assign(this, WebGLPlatform.prototype);
			WebGLPlatform.call(this);
		} else {
			(<any>Object).assign(this, CanvasPlatform.prototype);
			CanvasPlatform.call(this);
		}
	}

	public drawImage: (image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number) => void;
	public clear: () => void;
}