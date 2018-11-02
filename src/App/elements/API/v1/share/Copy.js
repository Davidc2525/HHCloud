import ApiInstance from "../Api.js"


class Copy {
	constructor({
		owner, spath, srcpath, dstpath,
		thenCB = () => {},
		catchCB = () => {},
		onProgress = () => {},
		onReady = () => {}
	}) {
		this.owner = owner;
		this.spath = spath;
		this.srcpath = srcpath;
		this.dstpath = dstpath;
		//this.path = path;
		//this.dstPath = dstPath;
		this.thenCB = thenCB;
		this.catchCB = catchCB;
		this.onProgress = onProgress;
		this.onReady = onReady;
		


		this.timestart = new Date().getTime()

		try {
			ApiInstance.instance.callOperation("fs::status", {
				owner:this.owner, 
				spath: this.spath,
				subpath: this.srcpath,
				thenCB: this.onGetStatus.bind(this),
				catchCB: catchCB
			})
		} catch (e) {
			console.error(e)
		}
	}

	onGetStatus(payload) {
		console.log(payload, this)
		this.srcSize = payload.payload.size; //data a payload
		this.dstSize = 0;


		if (payload.status == "ok") {
			ApiInstance.instance.fetch({
					apiArg: {
						owner:this.owner, 
						spath:this.spath, 
						srcpath:this.srcpath, 
						dstpath:this.dstpath,
						op: "user::copy"
					}
				},"share")
				.then(x => {
					this.timeend = new Date().getTime()
					if (x.status == "ok") {
						if (this.intervalUpdate != null) {
							clearInterval(this.intervalUpdate);
						}
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
					if(this.intervalUpdate!=null){
						clearInterval(this.intervalUpdate); 
					}
					this.catchCB({
						status: "error",
						...x
					})

				})


			this.intervalUpdate = setInterval(() => {

				ApiInstance.instance.callOperation("status", {
					path: this.dstpath,
					thenCB: (x) => {
						this.dstSize = x.payload.size;
					},
					catchCB: x => { clearInterval(this.intervalUpdate); this.catchCB(x)}
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

export {Copy};
export default Copy;