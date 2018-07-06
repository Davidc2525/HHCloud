import {
	fromJS
} from "immutable"

const state = {

	paths: {
		"/": {
			type: "folder",
			status: "empty",
			path: "/",
			data: {
				content: [{
					type: "folder",
					name: "musica",
					path: "/musica"
				}, {
					type: "folder",
					name: "imagenes",
					path: "/imagenes"
				}, {
					type: "folder",
					name: "cosas de proyecto",
					path: "/cosas de proyecto"
				}]
			}
		},
		"/musica": {
			type: "folder",
			status: "empty",
			path: "/musica",
			data: {
				content: [{
					type: "file",
					name: "a.mp3",
					path: "/musica/a.mp3"
				}]
			}
		},
		"/musica/a.mp3": {
			type: "file",
			status: "empty",
			path: "/musica/a.mp3",
			data: {}
		},
		"/imagenes": {
			type: "folder",
			status: "empty",
			path: "/imagenes",
			data: {}
		},
		"/cosas de proyecto": {
			type: "folder",
			status: "empty",
			path: "/cosas de proyecto",
			data: {}
		}
	}

}
export default fromJS(state)