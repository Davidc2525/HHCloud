var Prism = require('./prism.js');
import worker from "worker-loader!./WorkerToGenerateBlobFile.js"


class RenderPrism {


	construntor() {
		//this.content = (content);
		this.lan = "html"

	}

	setLan(newLan) {
		this.lan = newLan;
	}
	renderAsPromise(c){

		//return Promise.resolve(this.render(c))
		return new Promise((r,x)=>{
			const w = new worker(); 
			w.onmessage = (e)=>{
				r(e.data)
			}
			w.postMessage({action:"prism",content:atob(c),lan:this.lan})
		})
	}
	render(c) {
		var content = "";

		try {
			
			content = Prism.highlight(atob(c), Prism.languages[this.lan]);

		} catch (e) {
			throw e
		}
		return content;
	}

}

export default RenderPrism;