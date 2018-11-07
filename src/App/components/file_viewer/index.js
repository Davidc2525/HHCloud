
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
import Loadable from 'react-loadable';

import {
	exts,
	image,
	video,
	isAudioFile,
	isCodeFile,
	isTextFile,
	isImageFile,
	isVideoFile,
	isPdfFile,
	isDoc
} from "./maps.js"
import fileextension from "file-extension"

import   "./prism.css"

import ApiInstance from "../../elements/API/v1/Api.js"
//import FW from 'react-file-viewer';

function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else {
    return <div>Espere</div>;
  }
}
const FW = Loadable({
	loader: () =>
		import ('react-file-viewer').then(x => Promise.resolve(x.default)),
	loading: Loading
});


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

	createUrl = _ =>{
		var url;
		const {isShare} = this.props;
		if(isShare){
			const owner = this.encodeData(this.props.item.get("owner"));
			const spath = this.encodeData(this.props.item.get("spath"));
			const subpath = this.encodeData(this.props.item.get("subpath"));

			url = `${ApiInstance.instance.urlService}opener?type=s&owner=${owner}&spath=${spath}`;

			if(!subpath==null||!subpath==""){
				url=url+`&subpath=${subpath}`;
			}
		}else{
			const item = this.props.item.get("payload")
			const path = this.encodeData(item.get("path"))

			url = `${ApiInstance.instance.urlService}opener?path=${path}`
		}
		return url;
	}

	componentDidMount() {
		//return
		const item = this.props.item.get("payload")
		const path = item.get("path")
		const name = item.get("name")
		const fe = fileextension(path)
		if (isTextFile(name)) {
			var openerPath = this.createUrl();
			fetch(openerPath, {
			    mode: 'cors',
				credentials: "include"
			}).then(r => r.text()).then(contentText => {

				this.setState({
						typeMedia: "text",
						contentValue: contentText
					})
			})
		}
		if (isCodeFile(name)) {

			try {
				var openerPath = this.createUrl();
				fetch(openerPath, {
				    mode: 'cors',
					credentials: "include"
				}).then(r => r.text()).then(contentText => {

					this.getContent(fe,contentText)
						.then(x => this.setState({
							typeMedia: "text",
							contentValue: x
						}))
				})
				return;
				//var contentValue = Prism.highlight(atob(item.get("data").get("fileBase64Content")), Prism.languages[lagn]);

			} catch (e) {

			}
		}

		if (isImageFile(name)) {

			try {

					this.setState(_=>({typeMedia:"image",contentValue:this.createUrl()}))
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


		if (isVideoFile(name)) {

			try {


				this.setState(_=>({typeMedia:"video",contentValue:this.createUrl()}))
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
			this.setState(_=>({typeMedia:"audio",contentValue:this.createUrl()}))
				return

		}

		if (isPdfFile(name)) {

			try {
				this.setState(_ => ({
							typeMedia: "pdf",
							contentValue: this.createUrl()
						}))

				return

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
		if (isDoc(name)) {

			try {
				fetch(this.createUrl(),{mode: 'cors',credentials:"include"})
					.then(x => x.blob()).then(x => {

						this.setState(_ => ({
							docType:fe,
							typeMedia: "doc",
							contentValue: URL.createObjectURL(x)
						}))
					})

				return

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
	getContent(ex,content){

		var contentValue = null;
		if(exts.hasOwnProperty(ex)){
			var data = exts[ex];

			if(typeof data == "string" && this.viewTextFiles(ex)){
				return  Promise.resolve((content))
			}else{

				var render = new this.renderes[data[0]]()
					render.setLan(data[1])
					return render.renderAsPromise((content))
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

		const item = this.props.item.get("payload")
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
						{false&&<Player style={{maxWidth:"100%"}} item={item} contentValue={this.state.contentValue}/>}
						{true&&<video id="univideo" autoPlay={true} controls style={{width:"100%"}} src={this.state.contentValue}>
							<source src={this.state.contentValue} type={mimeContent}/>
							Your browser does not support the video tag.
						</video>}
					</div>
				}

				{
					this.state.typeMedia=="audio"&&this.state.contentValue!=null&&
					<div  style={styles.videoContent}>
						{false&&<Player style={{maxWidth:"100%"}} item={item} contentValue={this.state.contentValue}/>}
						{true&&<audio id="univideo" autoPlay={true} controls style={{width:"100%"}} src={this.state.contentValue}>
							<source src={this.state.contentValue} type={mimeContent}/>
							Your browser does not support the video tag.
						</audio>}
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

				{
					this.state.typeMedia=="doc"&&this.state.contentValue!=null&&
					<div id="doc">
						 <div>
						 	<FW style={{width:"100%",height:"calc(100% - 50px)"}}
						 		fileType={this.state.docType}
        						filePath={this.state.contentValue}/>
					      </div>
					</div>
				}
			</div>)
		//return <div><PrismCode> var a = 1 </PrismCode></div>
	}
}

export default FileViewer;
