import fileExtension from "file-extension"
import Mime from "mime-types"
window.mime = Mime

const image = {
	"png": ["image", "png"],
	"jpg": ["image", "jpg"],
	"jpeg": ["image", "jpeg"],
	"gif": ["image", "gif"],
}

const video = {
	"mp4": ["video", "mp4"],
	"avi": ["video", "avi"],
	"m4a": ["video", "m4a"],
	"wma": ["video", "wma"],

}

const audio = {
	"mp3": ["video", "mp3"],
}

const text = {
	"txt":["plaint", "txt"]
}


const exts = {
	/*ico: "image",
	png: "image",
	jpg: "image",
	jpeg: "image",
	wav: "audio",
	mp3: "audio", 
	mp4: "video",*/


	"gpl": ["plaint", "txt"],
	"cfg": ["plaint", "txt"],
	"log": ["plaint", "txt"],
	//"txt": ["plaint", "txt"],
	"xhtml": ["plaint", "txt"],
	"csv": ["plaint", "txt"],
	"bat": ["prism", "batch"],
	"jsp": ["prism", "html"],
	"properties": ["prism", "properties"],
	"sh": ["prism", "shell"],
	"xml": ["prism", "xml"],
	"py": ["prism", "python"],
	"htaccess": ["plaint", "txt"],
	"makefile": ["prism", "makefile"],
	"java": ["prism", "java"],
	"sql": ["prism", "sql"],
	"php": ["prism", "php"],
	"md": ["prism", "markdown"],
	"html": ["prism", "html"],
	"css": ["prism", "css"],
	"sass": ["prism", "sass"],
	"less": ["prism", "less"],
	"json": ["prism", "json"],
	"yml": ["prism", "yaml"],
	"js": ["prism", "jsx"],
	"jsx": ["prism", "jsx"],
	"cpp": ["prism", "cpp"],
	"c": ["prism", "c"],
	"h": ["prism", "c"],


	//docx: "document",
	//doc: "document",

}

const mimes = {
	"image/x-icon": "image",


	"video/mp4": "video",


	"audio/wave": "audio",

	"application/x-sql": ["prism", "sql"],
	"text/plain": "text",
	"text/x-java-source": ["prism", "java"],
	"text/html": ["prism", "html"],
	"text/html": ["prism", "html"],
	"text/css": ["prism", "css"],
	"application/json": ["prism", "javascript"],
	"application/x-httpd-php": ["prism", "php"],
	"application/javascrip": ["prism", "javascrip"],
}


const isCodeFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;

	if (exts.hasOwnProperty(ex)) {
		can = true;
	}
	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(exts.hasOwnProperty(mime)){
			can = true;
		}
	}
	return can
}

const isTextFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;

	if (text.hasOwnProperty(ex)) {
		can = true;
	}

	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(text.hasOwnProperty(mime)){
			can = true;
		}
	}


	return can
}

const isImageFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;

	if (image.hasOwnProperty(ex)) {
		can = true;
	}
	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(image.hasOwnProperty(mime)){
			can = true;
		}
	}


	return can
}

const isVideoFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;

	if (video.hasOwnProperty(ex)) {
		can = true;
	}

	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(video.hasOwnProperty(mime)){
			can = true;
		}
	}

	return can
}

const isAudioFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;

	if (audio.hasOwnProperty(ex)) {
		can = true;
	}

	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(audio.hasOwnProperty(mime)){
			can = true;
		}
	}

	return can
}

const isPdfFile = (filename) => {
	var ex = fileExtension(filename)
	var can = false;
	can = ex == "pdf";
	if(!can){
		var mime = Mime.extension(Mime.contentType(filename))
		if(mime == "pdf"){
			can = true;
		}
	}
	return can;
}

export {
	text,
	exts,
	image,
	audio,
	video,

	isCodeFile,
	isTextFile,
	isImageFile,
	isAudioFile,
	isVideoFile,
	isPdfFile,
}