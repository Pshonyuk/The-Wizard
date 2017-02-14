interface ISession {
	resolve?: any,
	reject?: any,
	onLoad?: Promise<HTMLImageElement[]>,
	active: boolean,
	data: HTMLImageElement[]
}

const imagesCache: {[key: string]: HTMLImageElement} = {},
	sessions: ISession[] = [];
let currentSessionId: number;



export module Resources {
	function checkLoad(sessionId: number): void {
		const session = sessions[sessionId];
		if (!session.active) {
			const onLoad = session.data.every(item => item !== null);
			if (onLoad) {
				session.resolve(session.data);
			}
		}
	}

	export function startSession(): number {
		const session: ISession = {
			active: true,
			data: []
		};

		session.onLoad = new Promise<HTMLImageElement[]>((resolve, reject) => {
			session.resolve = resolve;
			session.reject = reject;
		}).then((data) => {
			session.resolve = session.reject = null;
			return data;
		}).catch((err) => {
			session.resolve = session.reject = null;
			return err;
		});

		currentSessionId = sessions.length;
		sessions.push(session);
		return currentSessionId;
	}

	export function stopSession(sessionId: number = currentSessionId): void {
		sessions[sessionId].active = false;
		checkLoad(sessionId);
	}

	export function onLoad(sessionId: number = currentSessionId): Promise<HTMLImageElement[]> {
		return sessions[sessionId].onLoad;
	}

	export function loadImage(url: string, sessionId: number = currentSessionId): Promise<HTMLImageElement> {
		const data = sessions[sessionId].data,
			index: number = data.length;

		sessions[sessionId].data.push(null);
		url = url.trim();

		return new Promise((resolve, reject) => {
			if (imagesCache[url]) {
				data[index] = imagesCache[url];
				resolve(imagesCache[url]);
				checkLoad(sessionId);
				return;
			}

			const image = new Image();
			image.src = url;

			image.onload = () => {
				image.onload = image.onerror = null;
				imagesCache[url] = data[index] = image;
				resolve(imagesCache[url]);
				checkLoad(sessionId);
			};

			image.onerror = () => {
				const err = `Error load ${image.src}`;
				image.onload = image.onerror = null;
				sessions[sessionId].reject(err);
				reject(err);
			};
		});

	}
}