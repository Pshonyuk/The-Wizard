interface IRigidbodyParams {
	mass?: number,
	linearDrag?: number,
	angularDrag?: number,
	gravityScale?: number
}

export class Rigidbody {
	static get defaults(): IRigidbodyParams {
		return {
			mass: 1,
			linearDrag: 0,
			angularDrag: 0.05,
			gravityScale: 1
		}
	}

	private _params: IRigidbodyParams;


	constructor(params: IRigidbodyParams) {
		this._params = { ...Rigidbody.defaults, ...params };
	}
}