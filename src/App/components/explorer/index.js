import React from "react"
import {connect} from "react-redux"
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import { withRouter } from 'react-router'

@connect((state,props)=>{

	return {path:props.location.search}

})
class Explorer extends React.Component {



	constructor(props) {

		super(props)
 

	}

	render(){
		return (

			<div>
			<br/>
            <Link  to="/unidad?path=/musica">/musica</Link>
            <br/>
            <Link  to="/unidad?path=/imagenes">/imagenes</Link>
            <br/>
            <Link  to="/unidad?path=/imagenes/cars/akjshd/asdas">/imagenes/cars/akjshd/asdas</Link>
            <br/>
          
			 {this.props.path}</div>
			)
	}

}

export default withRouter(Explorer);