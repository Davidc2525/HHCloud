
import React,{Component} from "react"
import worker from "worker-loader!./WorkerToGenerateBlobFile.js"
/**/
import RenderPrism from "./RenderPrism.js"
import RenderPlaint from "./RenderPlaint.js"
/**/

import Button from '@material-ui/core/Button';
import {store} from "../../redux/index.js"

import {exts} from "./maps.js"
import fileextension from "file-extension"
//import { Document } from 'react-pdf/dist/entry.webpack';
//import {  Page } from 'react-pdf'
//var Prism = require('prismjs');
//var Prism = require('./prism.js');
 
import   "./prism.css"



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

	componentDidMount() {
		//return
		const item = this.props.item
		const path = item.get("path")
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

	render(){

		const item = this.props.item
		const path = item.get("path")
		const fe = fileextension(path)


		

		return (<div>
				<Button  onClick={_=>{this.getBlobUrl(item)}} >Generar enlace</Button>
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
					fe=="pdf"&&
					<div>
						 <div>
					        {/*<Document
					          file={"data:application/pdf;base64,"+item.get("data").get("fileBase64Content")}
					          //onLoadSuccess={this.onDocumentLoad}
					        >
					        </Document>
					         */}
					       
					      </div>
					</div>
				}
			</div>)
		//return <div><PrismCode> var a = 1 </PrismCode></div>
	}
}

export default FileViewer;