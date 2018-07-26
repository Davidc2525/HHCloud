//RenderImage.js
import ApiInstance from "../../elements/API/v1/Api.js"
class RenderImage {

	construntor() {
		//this.content = (content);
		//this.lan = "text"

	}

	setLan(newLan) {
		this.lan = newLan;
	}
	renderAsPromise(item) {

		return new Promise((resolve, reject) => {
			ApiInstance.instance.callOperation("download", {
				path: item.get("path"),
				onLoad: xhr => {

					resolve(URL.createObjectURL(new Blob([xhr.response], {
						type: item.getIn(["data", "mime"])
					})));

				},
				onError: reject
			})
		})
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

export default RenderImage