
import React from "react";
import { withRouter } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import { getParent, isRoot, parsePath, tryNormalize } from "./../explorer/Util.js";
import { connect } from "react-redux";

@withRouter
@connect((state,props)=>{
	let downloads = state.get("downloads").get("downloads")
	let uploads = state.get("uploads").get("uploads")

 	return { uc:uploads.count(),dc: downloads.count() }
})
class Title extends React.Component{
render(){
		const {uc,dc,location} = this.props
		const {hash} = location;
        return   (
            <span id="title">
	            <Switch>
	              <Route exact path="/SC/" render={
	                ({location})=>{
	                	document.title=`Control`
	                	return <span/>
	                }
	              }/>

	              <Route path="/SC/unidad" render={
	                ({location})=>{
	                	let loc = location.hash
	                	loc = tryNormalize(parsePath(loc))
	                	try{
	                		loc = decodeURIComponent(loc)
	                	}catch(e){console.error(e)}
	                	document.title=`Unidad: ${loc}`
	                	return <span/>
	                }
	              }/>

	              <Route path="/SC/account" render={
	                 _=>{
	                 	console.log(_)
	                	document.title="Cuenta"
	                	return <span/>
	                }
	              }/>

	              <Route path="/SC/download" render={
	                 _=>{
	                 	if(dc>0){
	                		document.title=`Descargando ${dc}`

	                 	}else{
	                		document.title="Descargando"
	                 	}
	                	return <span/>
	                }
	              }/>
	              
	              <Route path="/SC/upload" render={
	                 _=>{
	                 	if(uc>0){
	                		document.title=`Subiendo ${uc}`
	                 	}else{
	                 		document.title="Subiendo"
	                 	}
	                	
	                	return <span/>
	                }
	              }/>

	              <Route path="/SC/login" render={
					
						({location}) => {
							let hash = location.hash
							if (hash == "") {
								document.title = `Iniciar sesion`
							} else {
								if ("#0"==hash) {
									document.title = `Iniciar sesion`
								}
								if ("#1"==hash) {
									document.title = `Registrarte`
								}
								if ("#2"==hash) {
									document.title = `Recuperar contraseña`
								}
							}

							return <span/>
						}
					
	              }/>


	              <Route render={
	                _=>{
	                	document.title="HHCloud"
	                	return <span/>
	                }
	              }/>
	            </Switch>
            </span>
      )
  }

}

export default Title
export {Title}