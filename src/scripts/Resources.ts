const imagesCache: {[key: string]: HTMLImageElement} = {};
let isActiveSession = false;


export module Resources {
    export function startSession() {
        isActiveSession = true;
    }

    export function stopSession() {
        isActiveSession = false;
    }

    export function loadImage(url: string) {
        if(!isActiveSession) throw new Error("No active session.");
        url = url.trim();

        if(imagesCache[url]) {
            return imagesCache[url];
        } else {
            const image = new Image();
            image.src = url;
            image.onload = () => {
                imagesCache[url] = image;
                image.onload = null;
                return imagesCache[url];
            }
        }
    }
}