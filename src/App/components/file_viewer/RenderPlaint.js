class RenderPlaint {

	construntor() {
		//this.content = (content);
		this.lan = "text"

	}

	setLan(newLan) {
		this.lan = newLan;
	}
	render(c) {
		var content = "";

		try {

			content = atob(c);

		} catch (e) {
			throw e
		}
		return content;
	}


}

export default RenderPlaint