const fragmentShaders = [
	require("./shader-fs.glsl")
];
const vertexShaders = [
	require("./shader-vs.glsl")
];


class ViewPort {
	public ctx: CanvasRenderingContext2D = null;
	public gl: WebGLRenderingContext = null;

	constructor(public el: HTMLCanvasElement) {
	}

	get width(): number {
		return this.el.width;
	}

	get height(): number {
		return this.el.height;
	}

	_init2DContext(){
		this.ctx = this.el.getContext("2d");
	}

	_initWebGL(): void {
		let e;
		try {
			this.gl = this.el.getContext("webgl") || this.el.getContext("experimental-webgl");
		}
		catch (e) {
		}
	}
}


class CanvasPlatform implements RenderPlatform {
	public viewPort: ViewPort;
	public ctx: CanvasRenderingContext2D;

	constructor() {
		this.ctx = this.viewPort.ctx;
	}

	public drawImage(...args): void {
		this.ctx.drawImage.apply(this.ctx, args);
	}

	public clear(): void {
		const viewPort = this.viewPort;
		this.ctx.clearRect(0, 0, viewPort.width, viewPort.height)
	}
}


class WebGLPlatform implements RenderPlatform {
	public viewPort: ViewPort;
	public gl: WebGLRenderingContext;
	public program: WebGLProgram;

	constructor() {
		this.gl = this.viewPort.gl;
		this._initGL();
		this._initShaders();
	}

	public drawImage(image): void {
		const gl = this.gl,
			program = this.program;
	}

	public clear(): void {
		const gl = this.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	private _initGL(): void {
		const gl = this.gl;
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	private _initShaders(): void {
		const gl = this.gl,
			program = this.program = gl.createProgram();

		vertexShaders.forEach(source => {
			const shader = this._compileShader(source, "x-vertex");
			gl.attachShader(program, shader);
		});

		fragmentShaders.forEach(source => {
			const shader = this._compileShader(source, "x-fragment");
			gl.attachShader(program, shader);
		});

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Unable to initialize the shader program.");
		}

		gl.useProgram(program);

		const vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPositionAttribute);
	}

	private _compileShader(source: string, type: "x-fragment" | "x-vertex"): WebGLShader {
		const gl = this.gl,
			shader = gl.createShader(type === "x-fragment" ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
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
			this.viewPort._init2DContext();
			(<any>Object).assign(this, CanvasPlatform.prototype);
			CanvasPlatform.call(this);
		}
	}

	public drawImage: (image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number) => void;
	public clear: () => void;
}