//DirectoryListVirtualize.jsx
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Edit from '@material-ui/icons/Edit';
import FileDownload from '@material-ui/icons/FileDownload';
import FilterNone from '@material-ui/icons/FilterNone';
import FlipToFront from '@material-ui/icons/FlipToFront';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import InputIcon from '@material-ui/icons/Input';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import PhotoIcon from '@material-ui/icons/Photo';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import TextIcon from '@material-ui/icons/TextFields';
import filesize from "filesize";
import { List as ListI, Map } from "immutable";
import PropTypes from 'prop-types';
import React from "react";
import { connectMenu, ContextMenu, ContextMenuTrigger, MenuItem as MenuItemCM } from "react-contextmenu";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import { DownloadManagerInstance } from "../../elements/download_manager/index.js";
import { store } from "../../redux/index.js";
import { isAudioFile, isCodeFile, isImageFile, isPdfFile, isTextFile, isVideoFile } from "../file_viewer/maps.js";
import { deletingPath } from "./actions.js";

const styles = theme => ({
  headerHelper:{
  	height:"100px",
  	width: "-moz-available",
  	width:"-webkit-fill-available",
  	position:"fixed",
  	zIndex:1,
  	padding:"0px",
  	backgroundColor:theme.palette.background.paper,
  	boxSizing: "border-box",
  },
  root: {
  	// overflowY: "scroll",
  	 //boxSizing: "border-box",
  	[theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 2,
    },

  	//height:"100%",
    flexGrow: 1,

  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  ContextMenu: {
  	zIndex:theme.zIndex.tooltip,

  	//backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 0,
    paddingLeft: theme.spacing.unit * 0,
    textAlign: 'start',

  },
   card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
  toolbar: theme.mixins.toolbar,
});



function collect(props) {
    return props;
}

const DynamicMenu = (props) => {
    const { id, trigger ,classes} = props;
    const isFile = trigger ? trigger.item.get("file"):false

    const handleItemClick = trigger ? trigger.onItemClick : null;

    return (
        <ContextMenu style={{zIndex:"2000"}} id={id}>

            <Paper  elevation={5} className={classes.ContextMenu}>

            	{trigger && !trigger.disabled &&
            		<div>
				        <List >

					        <MenuItemCM onClick={handleItemClick} data={{ action: 'open' }}>
						        <ListItem button >
						          <Avatar>
						            <InputIcon />
						          </Avatar>
						          <ListItemText primary={isFile?"Abrir":"Entrar"} />
						        </ListItem>
					        </MenuItemCM>

					        <MenuItemCM onClick={handleItemClick} data={{ action: 'rename' }}>
						        <ListItem button >
						          <Avatar>
						            <Edit />
						          </Avatar>
						          <ListItemText primary="Cambiar nombre" />
						        </ListItem>
					        </MenuItemCM>

					        <MenuItemCM onClick={handleItemClick} data={{ action: 'copy' }}>
						        <ListItem button >
						          <Avatar>
						            <FilterNone />
						          </Avatar>
						          <ListItemText primary="Copiar en" />
						        </ListItem>
					        </MenuItemCM>

					        <MenuItemCM onClick={handleItemClick} data={{ action: 'move' }}>
						        <ListItem button >
						          <Avatar>
						            <FlipToFront />
						          </Avatar>
						          <ListItemText primary="Mover a" />
						        </ListItem>
					        </MenuItemCM>


					        <MenuItemCM onClick={handleItemClick} data={{ action: 'delete' }}>
						        <ListItem button >
						          <Avatar>
						            <DeleteForever />
						          </Avatar>
						          <ListItemText primary="Eliminar" />
						        </ListItem>
					        </MenuItemCM>

					         <MenuItemCM onClick={handleItemClick} data={{ action: 'download' }}>
						        <ListItem button >
						          <Avatar>
						            <CloudDownload />
						          </Avatar>
						          <ListItemText primary="Descargar" />
						        </ListItem>
					        </MenuItemCM>
				      	</List>

            		</div>
            	}
            </Paper>

        </ContextMenu>
    );
};

DynamicMenu.propTypes = {
    id: PropTypes.string.isRequired,
    trigger: PropTypes.shape({
        name: PropTypes.string.isRequired,
        onItemClick: PropTypes.func.isRequired,
        allowRemoval: PropTypes.bool
    }).isRequired
};

const ConnectedMenu = connectMenu("itemList")(withStyles(styles,{theme:true})(DynamicMenu))

@connect(state=>{

	var toolBar = state.getIn(["explorer","toolBar"]);
	var selection = state.getIn(["explorer","selection"]);
	var online = state.getIn(["app","online"])
	return {online:online,toolBar,filter:toolBar.get("filter"),isSelecteMode:selection.get("isSelecteMode")}
})
@withMobileDialog()
class DirectoryListVirtualize extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			filter:"",
			renamedialog: false,

			sortBy: "name",
			order:true //true = asc, false = desc
		}
		window.fs = this

		store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"folder"}})		
	}

	componentWillUpdate(){
		//store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"folder"}})
	}

	handleItemEvent = (event, data) => {
		if(!this.props.online)return

		if (data.action == "checkInList") {
			if(data.checked){
				store.dispatch({type:"ADD_ITEM_SELECTION",payload:{item:data.item}})
			}else{
				store.dispatch({type:"REMOVE_ITEM_SELECTION",payload:{item:data.item}})
			}
		}

		if (this.props.isSelecteMode) {return}

		if (data.action == "open") {
			store.dispatch(push("/SC/unidad#" + data.item.get("path")))
			//this.props.history.push("/SC/unidad#" + data.item.get("path"))
			//store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:data.item.get("file")?"file":"folder"}})
		}
	}


	handleClickItemMenuContext = (e, data, target) => {
		
		if (data.action === 'download') {
			DownloadManagerInstance.instance.addDownload(data.item)
			//console.error(data)
			return;
		}

		if (data.action === 'open' ) {

			store.dispatch(push("/SC/unidad#" + data.item.get("path")))
			//this.props.history.push("/SC/unidad#"+data.item.get("path"))
			//console.error(this.props.history,this.props.history.push,push)
			return
		}

		if(data.action==="delete"){
			store.dispatch(deletingPath(data.item.get("path"),data.item.get("name")))
		}

		if(data.action==="copy"){
			store.dispatch({
				type:"OPEN_MOVE_OR_COPY_DIALOG",
				//middle:"EXPLORER",
				payload:{
					op:"copy",
					path:data.item.get("path"),
					name:data.item.get("name")
				}
			})
		}

		if(data.action==="move"){
			store.dispatch({
				type:"OPEN_MOVE_OR_COPY_DIALOG",
				//middle:"EXPLORER",
				payload:{
					op:"move",
					path:data.item.get("path"),
					name:data.item.get("name")
				}
			})
		}
		if (data.action === 'rename' ) {
			store.dispatch({
				type: "OPEN_RENAME_DIALOG",
				nameFile: data.item.get("name"),
				path: data.item.get("path")
			})
			//this.setState(s=>({renamedialog:true}))
			return
		}
	}

	stateDownloadString(item) {
		var state = "";
		if (item.get("download") != undefined) {
			if (item.get("download") != "none") {
				state = item.get("download")
			}
		}

		return state!="" ? `, (${state})`:state;
	}

	sortBy(order, valueA, valueB) {

		var sort = 0;

		if (valueA < valueB) {
			sort = order ? -1 : 1
		}

		if (valueA > valueB) {
			sort = order ? 1 : -1
		}

		return sort;
	}

	setSortBy(sortBy,order=true){this.setState({sortBy,order})}

	isActiveDirectory(){
		const {isSelecteMode} = this.props;
		const {online} = this.props;

		return  !(isSelecteMode || !online)
	}


	IconByExt = ({item}) => {
		const visCodeFile = isCodeFile(item.get("name"));
		const visTextFile = isTextFile(item.get("name"));
		const visImageFile = isImageFile(item.get("name"));
		const visVideoFile = isVideoFile(item.get("name"));
		const visAudioFile = isAudioFile(item.get("name"));
		const visPdfFile = isPdfFile(item.get("name"));

		return (
			<ListItemAvatar >
	          <Avatar>
	          	{visTextFile&&<TextIcon/>}
	          	{visCodeFile&&<CodeIcon/>}
	          	{visImageFile&&<PhotoIcon/>}
	          	{(visVideoFile||visAudioFile)&&<MusicVideoIcon/>}
	          	{visPdfFile&&<PictureAsPdfIcon/>}

	           	{/**default*/
	           		(!visAudioFile&&!visTextFile&&!visCodeFile&&!visImageFile&&!visVideoFile&&!visPdfFile)&&
	           		<InsertDriveFile />
	           	}
	          </Avatar>
			</ListItemAvatar>	        
		)
	}

	_rowRenderer = ({index, isScrolling, isVisible, key, style,dataToRender,isSelecteMode,online,fullScreen,activeDirectory}) => {
	    const {classes,data,history} = this.props;

	    var item = dataToRender.get(index);
	    const selectioned = item.get("selectioned",false);
	    const isFile = item.get("file");
	   	const isHeader = item.get("header",false);
	   	item = item.set("top",style.top)
	    return (
	    	<div key={key} style={style}>
	    		{isHeader&&
		    		
					 	<ListItem style={{height:style.height}} divider >
			                    <ListItemText
			                      secondaryTypographyProps={{noWrap:true, variant:"body2"}}
			                      primaryTypographyProps={{noWrap:true, variant:"title"}}
			                      primary={item.get("name")}
			                      secondary={item.get("count")}
			                    />
				        </ListItem>
				    
			    }
		    	
		    	{!isHeader&&
		    		<ContextMenuTrigger
						//key={key}
						disabled={activeDirectory}
						onItemClick={this.handleClickItemMenuContext}
						item={item}
						name={item.get("name")}
						holdToDisplay={1000}
						collect={collect}

						id={"itemList"}>

						<ListItem  disabled={!online} disableRipple={activeDirectory} key={key} button onClick={(e)=>{
				          	this.handleItemEvent(e,{item,action:"open"})
				          	//history.push("/SC/unidad#"+item.get("path"))
				          }}
				         >
					        {isSelecteMode&&<Checkbox checked={selectioned} onChange={
					         	(e,c)=>{
					         		this.handleItemEvent(e,{item,action:"checkInList",checked:c})
					         		return false
					         	}
					        }/>}
					        
					        {/*Icon*/}
						        {/**File*/
						          	!isSelecteMode&&isFile&&
						          	<this.IconByExt item={item}/>			          		
						        }

						        {/**Folder*/
						        	!isSelecteMode&&!isFile&&
						          	<ListItemAvatar>
											<Avatar>
							          			{item.get("shared",false)?<FolderSharedIcon/>:<FolderIcon />}
											</Avatar>
						            </ListItemAvatar>
						        }
					        {/*Icon*/}
					        

							

					            {!isFile&& //folder
					            	<ListItemText
						              secondaryTypographyProps={{noWrap:true, variant:"body2"}}
						              primaryTypographyProps={{noWrap:true, variant:"title"}}
						              primary={item.get("name")}
						              secondary={`${item.get("elements")} elementos (${filesize(item.get("size"))}) ${this.stateDownloadString(item)}`}
					            />}

					            {isFile&& //file
					            	<ListItemText
						              secondaryTypographyProps={{noWrap:true, variant:"body2"}}
						              primaryTypographyProps={{noWrap:true, variant:"title"}}
						              primary={item.get("name")}
						              secondary={`${filesize(item.get("size"))} ${this.stateDownloadString(item)}`}
					            />
					            }

						        { 
						        	<ListItemSecondaryAction>

						             	{item.get("download") != undefined && item.get("download") == "downloading" &&
							              	<IconButton  aria-label="Descargar">
							                	<FileDownload />
							              	</IconButton>
						          		}

									{(item.get("shared",false) && item.get("file",true)) && 
										<IconButton  aria-label="Compartido" color="primary" >
										    <FolderSharedIcon />
									 	</IconButton>
									}

						            </ListItemSecondaryAction>
						        }

				        </ListItem>
				</ContextMenuTrigger>
		    	}


	    	</div>);
	};

	_rowHeight = ({index,fullScreen,dataToRender}) => {
		const item = dataToRender.get(index);

		if(item.get("header",false)){
			return fullScreen?73:73;
		}else{
			return fullScreen?64:53
		}
	}

	_setRef = windowScroller => {
	    this._windowScroller = windowScroller;
	};

	render(){

		const {classes,data,history,fullScreen} = this.props;
		const {filter}=this.props
		const headerFolder = count => new ListI([new Map({header:true,name:"Carpetas",count})])
		const headerFiles = count => new ListI([new Map({header:true,name:"Archivos",count})])
		const sortby = this.props.toolBar.get("sortBy")
		const order = this.props.toolBar.get("order")
		
		var dataToRender = new ListI();
		var dataList = data.get("payload"); //de data a payload
		if(filter!=""){
			try {
				const regex = new RegExp(filter, "ig");
				dataList = dataList.filter(x => regex.test(x.get("name")));
			} catch (e) {
				alert("El criterio de busqueda es incorrector, por favor corregir.")
				//console.error(e)
			}
		}

		const groups = dataList.groupBy(x=>x.get("file")?"file":"folder")

		var folders = groups.get("folder");	


		if(folders!=null){
			folders=folders.sortBy((x)=>x.get(sortby),(a,b)=>this.sortBy(order,a,b));
			dataToRender = dataToRender.concat(headerFolder(folders.count()));
		}else{
			folders = new ListI();
		}
		dataToRender = dataToRender.concat(folders);


		var files = groups.get("file");
		if(files!=null){
			files = files.sortBy((x)=>x.get(sortby),(a,b)=>this.sortBy(order,a,b));
			dataToRender = dataToRender.concat(headerFiles(files.count()));
		}else{
			files = new ListI()
		}
		dataToRender = dataToRender.concat(files);

		const {isSelecteMode} = this.props;
		const {online} = this.props;

		const activeDirectory = !this.isActiveDirectory()
		return (

				<div id="listV">
				  <ConnectedMenu />
					<WindowScroller
			          ref={this._setRef}
			          scrollElement={ window}>
			          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
			            <div >
			              <AutoSizer disableHeight>
			                {({width}) => (
			                	<List ref={registerChild} dense={!fullScreen}>
				                    <VList
				                      style={{outline:"black"}}
				                      ref={el => {
				                        window.listEl = el;
				                      }}
				                      autoHeight
				                      //className={styles.List}
				                      height={height}
				                      isScrolling={isScrolling}
				                      onScroll={onChildScroll}
				                      overscanRowCount={5}
				                      rowCount={dataToRender.count()}
				                      rowHeight={ fullScreen?64:53 }
				                      rowRenderer={({index, isScrolling, isVisible, key, style})=>
											this._rowRenderer({index, isScrolling, isVisible, key, style,dataToRender,isSelecteMode,online,fullScreen,activeDirectory})
				                      }
				                      //scrollToIndex={scrollToIndex}
				                      scrollTop={scrollTop}
				                      width={width}
				                    />
			                 
			                	</List>
			                 
			                )}
			              </AutoSizer>
			            </div>
			          )}
			        </WindowScroller>
				</div>	
		)
	}
}


class ErrorBoundary extends React.Component {
  constructor(props) {

    super(props);
    window.eb=this
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.warn(error, info);
  }

  handleClick = () => {
    try {
     this.setState({ hasError:false});
    } catch (error) {
      this.setState({ hasError:true });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div onClick={this.handleClick.bind(this)}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
export default (props)=>(

	<ErrorBoundary>
	  <DirectoryListVirtualize {...props} />
	</ErrorBoundary>

	);
