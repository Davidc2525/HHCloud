
import React,{Component} from "react"
import worker from "worker-loader!./WorkerToGenerateBlobFile.js"
import {DownloadManagerInstance} from "../../elements/download_manager/index.js"
/**/
import RenderPrism from "./RenderPrism.js"
import RenderPlaint from "./RenderPlaint.js"
import RenderImage from "./RenderImage.js"
import RenderVideo from "./RenderVideo.js"
/**/
import Player from "./Player.jsx"
import Button from '@material-ui/core/Button';
import {store} from "../../redux/index.js"

import {exts,image,video,isAudioFile} from "./maps.js"
import fileextension from "file-extension"

import   "./prism.css"




const styles = {
	videoContent:{
		justifyContent: "center",
		display: "flex",
		alignItems: "center"
	}
}

class FileViewer extends Component{
	constructor(props){
		super(props)

		this.renderes = {
			prism:RenderPrism,
			plaint:RenderPlaint
		}
		this.state={url:null,contentValue:null,typeMedia:"text"}
		store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"file"}})	

	}

	encodeData = (data="/") => {
    	return (data).split("").map(x=>x.charCodeAt()).map(x=>x.toString(16)).join(":")
	}

	decodeData = (dData=":") => {
	    return dData.split(":").map(x=>parseInt(("0x" + x))).map(x=>String.fromCharCode([x])).join("")
	}

	componentDidMount() {
		//return
		const item = this.props.item.get("data")
		const path = item.get("path")
		const name = item.get("name")
		const fe = fileextension(path)

		if (this.viewTextFiles(fe)) {

			try {

				this.getContent(fe, item.get("data").get("fileBase64Content"))
					.then(x => this.setState({
						typeMedia:"text",
						contentValue: x
					}))
				//var contentValue = Prism.highlight(atob(item.get("data").get("fileBase64Content")), Prism.languages[lagn]);

			} catch (e) {

			}
		}

		if (this.viewImageFiles(fe)) {

			try {

					this.setState(_=>({typeMedia:"image",contentValue:`http://orchi2:8080/api/opener?uid=k09809ss&path=${this.encodeData(item.get("path"))}`}))
					return;
					new RenderImage()
					.renderAsPromise(item)
					.then(x => this.setState({
						typeMedia:"image",
						contentValue: x
					}))
				
			} catch (e) {

			}
		}


		if (this.viewVideoFiles(fe)) {

			try {


				this.setState(_=>({typeMedia:"video",contentValue:`http://orchi2:8080/api/opener?uid=k09809ss&path=${this.encodeData(item.get("path"))}`}))
				return
				new RenderVideo()
					.renderAsPromise(item)
					.then(x => {
						this.setState({
							typeMedia: "video",
							contentValue: x
						})
						//URL.revokeObjectURL(x)
					})

			} catch (e) {

			}
		}

		if(isAudioFile(name)){
			this.setState(_=>({typeMedia:"audio",contentValue:`http://orchi2:8080/api/opener?uid=k09809ss&path=${this.encodeData(item.get("path"))}`}))
				return
				
		}

		if (this.viewPdfFile(fe)) {

			try {

				new RenderVideo()
					.renderAsPromise(item)
					.then(x => {
						this.setState({
							typeMedia: "pdf",
							contentValue: x
						})
						//URL.revokeObjectURL(x)
					})

			} catch (e) {

			}
		}


	}
	componentWillUnmount() {
		URL.revokeObjectURL(this.state.contentValue)
	}
	getContent(ex,base64Content){

		var contentValue = null;
		if(exts.hasOwnProperty(ex)){
			var data = exts[ex];
			
			if(typeof data == "string" && this.viewTextFiles(ex)){
				return  Promise.resolve(atob(base64Content))
			}else{
				
				var render = new this.renderes[data[0]]()
					render.setLan(data[1])
					return render.renderAsPromise((base64Content))
			}

		}else{
			throw `${ex} dont found`
		}

		//return contentValue;
	}	

	viewTextFiles(ex){
		var can = false;

		if(exts.hasOwnProperty(ex)){
			can = true;
		}

		/*if(ex == "js") can = true; 
		if(ex == "php") can = true; 
		if(ex == "javascript") can = true; 
		if(ex == "html") can = true; 
		if(ex == "java") can = true; 
		if(ex == "c") can = true; 
		if(ex == "cpp") can = true; 
		if(ex == "css") can = true; 
		if(ex == "py") can = true; 
		if(ex == "lo") can = true;*/ 
		return can 
	}

	viewImageFiles(ex){
		var can = false;

		if(image.hasOwnProperty(ex)){
			can = true;
		}

	
		return can 
	}

	viewVideoFiles(ex){
		var can = false;

		if(video.hasOwnProperty(ex)){
			can = true;
		}

	
		return can 
	}

	viewPdfFile(ex){			
		return ex=="pdf" 
	}

	getBlobUrl(item){

		const w = new worker()
		window.w = w
		w.onmessage =  (oEvent)=> {
		  //console.warn(oEvent);
		  this.setState({url:oEvent.data})
		};
		console.warn(item.get("data"))
		w.postMessage({action:"generate",content:item.get("data").get("fileBase64Content"),mime:item.get("data").get("mime")})
	}

	getUrl(){
		
		  this.setState(ps=>({url:ps.contentValue}))
		
	}

	download(item){
		DownloadManagerInstance.instance.addDownload(item);
	}

	render(){

		const item = this.props.item.get("data")
		const path = item.get("path")
		const fe = fileextension(path)

		const mimeContent = item.getIn(["mime"])
		

		return (<div>
				
				{
					this.state.url!=null&&
					<Button target="_blank" href={this.state.url} >
				        Abirir
				    </Button>
					
				}
				
				{
					this.state.typeMedia=="text"&&this.state.contentValue!=null&&
					<div>
						<pre style={{wordBreak:"break-word",whiteSpace:" pre-wrap",fontSize:"10px"}} dangerouslySetInnerHTML={{__html:this.state.contentValue}}/>
					</div>
				}

				{
					this.state.typeMedia=="image"&&this.state.contentValue!=null&&
					<div style={styles.videoContent} >
						<img style={{maxWidth:"100%"}} src={this.state.contentValue}/>
					</div>
				}

				{
					this.state.typeMedia=="video"&&this.state.contentValue!=null&&
					<div  style={styles.videoContent}>
						<Player style={{maxWidth:"100%"}} item={item} contentValue={this.state.contentValue}/>
						{false&&<video id="univideo" autoPlay={true} controls style={{width:"100%"}} src={this.state.contentValue}>
							<source src={this.state.contentValue} type={mimeContent}/>
							Your browser does not support the video tag.
						</video>}
					</div>
				}

				{
					this.state.typeMedia=="audio"&&this.state.contentValue!=null&&
					<div  style={styles.videoContent}>
						<Player style={{maxWidth:"100%"}} item={item} contentValue={this.state.contentValue}/>
						{false&&<video id="univideo" autoPlay={true} controls style={{width:"100%"}} src={this.state.contentValue}>
							<source src={this.state.contentValue} type={mimeContent}/>
							Your browser does not support the video tag.
						</video>}
					</div>
				}


				{
					this.state.typeMedia=="pdf"&&this.state.contentValue!=null&&
					<div id="pdf">
						 <div>					      	
					      	<object style={{width:"100%",height:"calc(100% - 50px)"}} data={this.state.contentValue} type="application/pdf">
							  <embed src={this.state.contentValue} type="application/pdf" />
							</object>
					      </div>
					</div>
				}
			</div>)
		//return <div><PrismCode> var a = 1 </PrismCode></div>
	}
}

export default FileViewer;