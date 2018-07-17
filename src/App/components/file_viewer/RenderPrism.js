var Prism = require('./prism.js');

class RenderPrism {


	construntor() {
		//this.content = (content);
		this.lan = "html"

	}

	setLan(newLan) {
		this.lan = newLan;
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