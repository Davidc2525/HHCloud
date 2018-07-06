import React from "react"
import {connect} from "react-redux"
import { BrowserRouter as Router, Route, Link,Redirect,Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import {store} from "../../redux/index.js"
import {parse} from "query-string"

@connect((state,props)=>{
	console.warn(store)
	var currentPath = parse(props.location.search).path
	let explorer = state.get("explorer");
	let paths = explorer.get("paths");
	let path = paths.get(props.location.search)

	if (!paths.has(currentPath)) {
		console.log("get path "+currentPath)
		store.dispatch({path:currentPath,type:"FETCHING_PATH",middle:"EXPLORER"})
		
		return {
			paths: paths.toArray(),
			path: null,
			explorer: state.get("explorer")
		}


	}

	return {
		paths: paths.toArray(),  
		path: paths.get(currentPath),
		explorer: state.get("explorer")
	}

}, dispatch => ({
  onClick: event => dispatch(honk()) // <-- empty payload
}))
class Explorer extends React.Component {


 
	constructor(props) {

		super(props)
 

	}

	render(){
		console.error(this.props)
		return (

			<div>
			
	          	{this.props.paths.map(x=>
	          		<div>
	          	 		{<Link to={`/unidad?path=${x.get("path")}`} >{x.get("path")}</Link>} 
	          	 	</div>
	          	 )}
				
				 {this.props.path != null ?
				 <div>


				 	{this.props.path.getIn(["data","content"]) != null ?

				 		this.props.path.getIn(["data","content"]).toArray().map(x=><div>{x.get("path")}</div>)
				 		:
				 		<div>none</div>
				 	}

				</div>
				 	:

				 	<div>cargando</div>

				 
				  }
			 </div>
          	
			)
	}

}

export default withRouter(Explorer);