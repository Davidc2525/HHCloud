//OrderSelect.jsx
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import {store} from "../../redux/index.js"
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import {connect} from "react-redux"
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

const options = isSelecteMode => {

	let ops = {
		'name': "Nombre",
		'size': "Tamaño",
		'modificationTime': "Modificacion",
		'accessTime': "Accedido",
		'mime': "Formato",

	}

	if(false&&isSelecteMode){
		ops = {...ops,selectioned:"Seleccion"}
	}

	return ops
};

const style = theme => ({
	root:{
		display:"flex",
		flexGrow:1,
		alignItems:"center",
		[theme.breakpoints.down("sm")]:{
			flexDirection: "row-reverse"
		}

	}
})

const ITEM_HEIGHT = 48;
@connect((state,props)=>{
	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	return {toolBar,selection}
})
@withStyles(style,{withTheme:true})
@withMobileDialog()
class OrderSelect extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
  	
    this.setState({ anchorEl: null});
  	
  };

  handleSelect = (option) => {
  	store.dispatch({type:"SORTBY_TOOLBAR",payload:{sortBy:option}})
    this.setState({ anchorEl: null ,option});
  	
  };

  render() {
    const { anchorEl } = this.state;
    const toolBar = this.props.toolBar;
    const isSelecteMode = this.props.selection.get("isSelecteMode")

	let opt = toolBar.get("sortBy")
	if(opt=="selectioned" && !isSelecteMode){
		opt="name";
	}
	const order = toolBar.get("order")
    //const op = this.state.option
    const {fullScreen,classes} = this.props
    return (
      <div className={classes.root}>
        {!fullScreen&&
        	<Button size="small" onClick={this.handleClick}>
        		{options(isSelecteMode)[opt]}
        	</Button>
        }

        {fullScreen&&
	        <IconButton size="small" onClick={this.handleClick}>        	
	          {<MoreVertIcon />}
	        </IconButton>
	    }

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              //maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {Object.keys(options(isSelecteMode)).map(key => (
            <MenuItem key={key} selected={key === opt} onClick={_=>this.handleSelect(key)}>
              {options(isSelecteMode)[key]}
            </MenuItem>
          ))}
        </Menu>
         <IconButton onClick={_=>{
         	//this.setState(p=>({order:!p.order}))
         	store.dispatch({type:"ORDER_TOOLBAR",payload:{order:!order}})
         }}  color="primary" aria-label="Add">
          {order? <KeyboardArrowDown />:<KeyboardArrowUp/>}
        </IconButton>
      </div>
    );
  }
}

export default OrderSelect;