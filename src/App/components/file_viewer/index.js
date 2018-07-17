
import React,{Component} from "react"
/**/
import RenderPrism from "./RenderPrism.js"
import RenderPlaint from "./RenderPlaint.js"
/**/


import {exts} from "./maps.js"
import fileextension from "file-extension"
//import { Document } from 'react-pdf/dist/entry.webpack';
//import {  Page } from 'react-pdf'
//var Prism = require('prismjs');
var Prism = require('./prism.js');


 
import   "./prism.css"
import PrismCode from "react-prism"
console.warn(Prism)
// The code snippet you want to highlight, as a string
var code = `

package orchi.SucreCloud.operations;



`;

// Returns a highlighted HTML string

class FileViewer extends Component{
	constructor(props){
		super(props)

		this.renderes = {
			prism:RenderPrism,
			plaint:RenderPlaint
		}

	}

	getContent(ex,base64Content){
		var contentValue = "";
		if(exts.hasOwnProperty(ex)){
			var data = exts[ex];
			
			if(typeof data == "string" && viewTextFiles(ex)){
				contentValue = atob(base64Content)
			}else{
				//var content = atob(base64Content)
				//console.warn(content)
				var render = new this.renderes[data[0]]()
					render.setLan(data[1])
					contentValue = render.render((base64Content))
			}

		}else{
			throw `${ex} dont found`
		}

		return contentValue;
	}	

	viewTextFiles(ex){
		var can = false;

		if(ex == "js") can = true; 
		if(ex == "php") can = true; 
		if(ex == "javascript") can = true; 
		if(ex == "html") can = true; 
		if(ex == "java") can = true; 
		if(ex == "c") can = true; 
		if(ex == "cpp") can = true; 
		if(ex == "css") can = true; 
		if(ex == "py") can = true; 
		return can 
	}


	render(){

		const item = this.props.item
		const path = item.get("path")
		const fe = fileextension(path)

		var cantView = true;
		//debugger
		try{

			var contentValue = this.getContent(fe,item.get("data").get("fileBase64Content") );
			//var contentValue = Prism.highlight(atob(item.get("data").get("fileBase64Content")), Prism.languages[lagn]);
			
		}catch(e){
			console.warn(e)
			cantView = false
		}

		return (<div>
				{
					cantView&&
					<pre>
					<code><div dangerouslySetInnerHTML={{__html:contentValue}}/></code>
					</pre>
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