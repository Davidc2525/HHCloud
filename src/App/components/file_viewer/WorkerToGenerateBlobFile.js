//WorkerToGenerateBlobFile.js
var Prism = require('./prism.js');
const tb64toBlob = (b64Data, contentType, sliceSize) => {
	var contentType = contentType || '';
	var sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {
		type: contentType
	});
	return blob;
}
const getUrl = (fileBase64Content, mime) => {
	var blob = tb64toBlob(fileBase64Content, mime)
	var blobUrl = URL.createObjectURL(blob);
	return blobUrl;
	//window.open(blobUrl, '_blank');
}

// Respond to message from parent thread
void self.addEventListener('message', (e) => {
	//debugger
	//console.warn(e.data)
	if (e.data.action == "generate") {
		self.postMessage(getUrl(e.data.content, e.data.mime))
	}

	if (e.data.action == "prism") {
		//console.warn(e.data)
		self.postMessage(Prism.highlight((e.data.content), Prism.languages[e.data.lan]))
	}
})