import React,{Component} from "react"

import {Route} from "react-router-dom";
import Chip from '@material-ui/core/Chip';
const styles = {
	chip_content:{
		border:"3px"
	}
}

class PathSee extends Component{
	getBeforePath(path, index) {
		const preRuta = path.split("#")[1].split("\/")		
		return preRuta.slice(0, index + 1)
	}
	render(){
		const {location,history} = this.props;
		return (
                <div>
	                <span style={styles.chip_content}>
	                	<Chip onClick={()=>{history.push("/unidad#/")}}  label={"home"}  /></span>                  
	                  	{

	                    		location.hash.split("#")[1].split("\/").slice(1).filter(x=>x!="").map((x,i)=>
	                      			<span style={styles.chip_content}>
										/
										
											
										<Chip onClick={()=>{history.push("/unidad#"+this.getBeforePath(location.hash,i).join("/")+"/"+x)}} key={i} label={x}  />
											
										
				                    </span>
								)
	                  }

                </div>

        )
	}
}

export default PathSee;