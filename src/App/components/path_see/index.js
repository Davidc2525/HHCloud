import React,{Component} from "react"
import { withStyles } from '@material-ui/core/styles';
import {Route} from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
const styles = theme => ({
	content: {
		//position: "fixed",
		//: "10px"
	},
	chip_content: {

		marginRight: "3px"
	}
})


@withStyles(styles,{whithTheme:true})
class PathSee extends Component{
	
	getHiddens(paths){
		return "/"+paths.slice(0,(paths.length/2)).map(x=>x.title).join("/")
	}

	render(){
		const {location,history,classes} = this.props;
		const {hash} = location;
		
		
		var paths = location.hash.split("#")[1].split("\/").slice(1).filter(x=>x!="").map((x,i,p)=>{
		
			return {path:"/"+p.slice(0,i+1).join("/"),title:x}

		})

		var split = paths.length>2

		var  pathsSee = []
		if(split){
			pathsSee=paths.slice((paths.length/2),paths.length)
		}else{
			pathsSee=paths
		}
		const hiddensPath = this.getHiddens(paths);
		return (
                <div className={classes.content}>
	                <span >
	                	<Chip className={classes.chip_content}  onClick={()=>{history.push("/SC/unidad#/")}}  label={"Mi Unidad"}  />
	                	{split?
							<Tooltip id="tooltip-fab" title={this.getHiddens(paths)}>
								<Chip 
									className={classes.chip_content} 
									onClick={()=>{history.push("/SC/unidad#"+hiddensPath)}}  
									label={"..."+hiddensPath.substring(hiddensPath.length-10,hiddensPath.length)} 
								/>
							</Tooltip>
	                		:null}

	                	</span>                  
	                  	{

	                		pathsSee.map((x,i)=>
	                  				<Chip className={classes.chip_content} onClick={()=>{history.push("/SC/unidad#"+x.path)}} key={x.title} label={x.title}  />
								
							)
	                  }

                </div>

        )
	}
}

export default PathSee;