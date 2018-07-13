import ApiInstance from "../Api.js"
const copy = _ => MoveOrCopyOperation.bind(null, {
	move: false
})
const move = _ => MoveOrCopyOperation.bind(null, {
	move: true
})

class MoveOrCopyOperation {
	constructor(type, {
		path = "/",
		dstPath = "/",
		thenCB = () => {},
		catchCB = () => {},
		onProgress = () => {},
		onReady = () => {}
	}) {

		this.path = path;
		this.dstPath = dstPath;
		this.thenCB = thenCB;
		this.catchCB = catchCB;
		this.onProgress = onProgress;
		this.onReady = onReady;
		this.type = type;


		this.timestart = new Date().getTime()

		try {
			ApiInstance.instance.callOperation("status", {
				path: this.path,
				thenCB: this.onGetStatus.bind(this),
				catchCB: catchCB
			})
		} catch (e) {
			console.error(e)
		}
	}

	onGetStatus(payload) {
		console.log(payload, this)
		this.srcSize = payload.data.size;
		this.dstSize = 0;


		if (payload.status == "ok") {
			ApiInstance.instance.fetch({
					apiArg: {
						path: this.path,
						dstPath: this.dstPath,
						op: this.type.move ? "move" : "copy"
					}
				})
				.then(x => {
					this.timeend = new Date().getTime()
					if (x.status == "ok") {
						this.thenCB({ ...x,
							time: this.timeend - this.timestart
						})
					} else if (x.status == "error") {
						this.catchCB({ ...x,
							time: this.timeend - this.timestart
						})
					}
				})
				.catch(x => {

					this.catchCB({
						status: "error",
						error: "connection_error",
						errorMsg: "error de coneccion"
					})

				})


			this.intervalUpdate = setInterval(() => {

				ApiInstance.instance.callOperation("status", {
					path: this.dstPath,
					thenCB: (x) => {
						this.dstSize = x.data.size;
					},
					catchCB: this.catchCB
				})

				if (this.dstSize == this.srcSize) {
					clearInterval(this.intervalUpdate)
					this.onReady(this)

				} else {
					this.onProgress(this, this.dstSize / this.srcSize * 100)
				}

			}, 1000)
		}



	}

}

export {copy,move};