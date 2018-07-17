const exts = {
	ico: "image",
	png: "image",
	jpg: "image",
	jpeg: "image",
	wav: "audio",
	mp3: "audio",
	mp4: "video",


	"cfg": ["plaint","txt"],
	"log": ["plaint","txt"],
	"txt": ["plaint","txt"],
	"bat": ["prism", "bat"],
	"sh": ["prism", "shell"],
	"xml": ["prism", "xml"],
	"py": ["prism", "python"],
	"htaccess": ["plaint","txt"],
	"java": ["prism", "java"],
	"sql": ["prism", "sql"],
	"php": ["prism", "php"],
	"md": ["prism", "markdown"],
	"html": ["prism", "html"],
	"css": ["prism", "css"],
	"json": ["prism", "json"],
	"js": ["prism", "jsx"],
	"jsx": ["prism", "jsx"],
	"c": ["prism", "c"],


	docx: "document",
	doc: "document",

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

export {exts}