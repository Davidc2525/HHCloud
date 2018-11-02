import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CloudCircleIcon from "@material-ui/icons/CloudCircle"
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux"
import {parsePath,tryNormalize} from "../explorer/Util.js"
import {
	push
} from "react-router-redux";
function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};
const styles2 = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	tabsIndicator: {
		backgroundColor: '#1890ff',
	},

	tabRoot: {
		textTransform: 'initial',
		minWidth: 50,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing.unit * 4,
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: '#40a9ff',
			opacity: 1,
		},
		'&$tabSelected': {
			color: '#1890ff',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: '#40a9ff',
		},
	},
	tabSelected: {},
	typography: {
		padding: theme.spacing.unit * 3,
	},
	tabRoot2:{minWidth:100,maxWidth:1000,textTransform:"none"},
	tabHome:{ minWidth:"70px"}
});
const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	tabHome:{ minWidth:"70px"}

});


@connect(state=>{
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	return {filter:toolBar.get("filter"),isSelecteMode:selection.get("isSelecteMode")}
})
class PathSee extends React.Component {

	constructor(props) {
		super(props)
		window.h=props.history
		console.warn("PathSee", props)

		const ps = this.parsePath(this.getPath(props))

		this.state = {
			value: ps.length,
			paths: ps
		};
		//this.update(this.state.paths.length,false)
	}

	update(value = 0, withPust = true) {

		var newLocation = locationToObject();
		if (value == 0) {
			newLocation.hash = "#/"

			withPust && this.props.history.push(newLocation)
		} else {
			newLocation.hash = this.state.paths[value - 1].path
			withPust && this.props.history.push(newLocation)
		}
	}
	handleChange = (event, value) => {
		if(this.props.isSelecteMode){return}
		this.update(value)
		//this.setState({ value });
	}
	componentWillReceiveProps(nextProps) {

		const paths = this.parsePath(this.getPath(nextProps));
		this.setState({
			paths,
			value: paths.length
		})
	}


	getPath({location}) {
		return location.hash;
	}
	parsePath(path) {

		var paths = tryNormalize(parsePath(path)).split("\/").slice(1).filter(x => x != "").map((x, i, p) => {
			var encodePath = x;
			try{
				encodePath = decodeURIComponent(encodePath);
			}catch(e){
				console.error(e)
			}
			return {
					path:  "/"+p.slice(0, i + 1).join("/"),
					title: encodePath
				}

		})
		return paths
	}

	getHiddens(paths) {
		return "/" + paths.slice(0, (paths.length / 2)).map(x => x.title).join("/")
	}
	render() {
		const {location,history,classes} = this.props;
		const {hash} = location;
	
	
	
	 
		const { value } = this.state;
		const {isSelecteMode} = this.props
		return (
			<div id="PathSee-2" className={classes.root}>
				<AppBar style={{boxShadow:"none"}}  position="static" color="default">
					<Tabs          	  
						value={value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						scrollable
						scrollButtons="off"
					>
					
					<Tab disabled={isSelecteMode} className={classes.tabHome} icon={<CloudCircleIcon/>} />
					{this.state.paths.map((x,i)=>
						<Tab 
						key={i.toString()}
						disabled={isSelecteMode}
						disableRipple
						//classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						className={classes.tabRoot2} label={x.title} />)}
						
						
					</Tabs>
				</AppBar>
			</div>
		);
	}
}

PathSee.propTypes = {
	classes: PropTypes.object.isRequired,
};

const locationToObject = _ => {
	var obj = {};
	var ignore = ["replace", "reload", "assign", "ancestorOrigins"];
	Object.keys(location).filter(x => !ignore.includes(x)).forEach(x => {
		obj[x] = location[x];
	})
	obj.toString = _ => obj.href;
	return obj;
}

export default withStyles(styles2)(PathSee);