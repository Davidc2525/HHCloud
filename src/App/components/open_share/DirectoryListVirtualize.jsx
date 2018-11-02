//DirectoryListVirtualize.jsx
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import FilterNone from '@material-ui/icons/FilterNone';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import InputIcon from '@material-ui/icons/Input';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import PhotoIcon from '@material-ui/icons/Photo';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
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
import { STATES } from "../../elements/auth/state.js";
import { store } from "../../redux/index.js";
import { locationToData } from "../explorer/Util.js";
import { isAudioFile, isCodeFile, isImageFile, isPdfFile, isTextFile, isVideoFile } from "../file_viewer/maps.js";
import { download } from "../share/SharedWithMe.jsx";
import { deletingPath } from "./actions.js";
import {
  ACTIONS as DIALOGS_ACTION
} from "../dialogs_share/actions.js";

import {mapActions} from "../dialogs_share/utils.js"
const styles = theme => ({
	headerHelper: {
		height: "100px",
		width: "-moz-available",
		width: "-webkit-fill-available",
		position: "fixed",
		zIndex: 1,
		padding: "0px",
		backgroundColor: theme.palette.background.paper,
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
		zIndex: theme.zIndex.tooltip,

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
@connect(state=>{
	const auth = state.get("auth");
	return {auth}
})
class DynamicMenu extends React.Component{
	render(){

		const { id, trigger, classes, auth } = this.props;

		const isFile = trigger ? trigger.item.get("file") : false;
		const owner = trigger ? trigger.item.get("owner") : false;
		
		const handleItemClick = trigger ? trigger.onItemClick : null;
		const state = auth.get("state");
		const userId = auth.getIn(["dataUser","user","id"],"");
		const showCopyInUnity = state==STATES[1] && userId!=owner;
		return (
			<ContextMenu style={{ zIndex: "2000" }} id={id}>

				<Paper elevation={5} className={classes.ContextMenu}>

					{trigger && !trigger.disabled &&
						<div>
							<List >

								<MenuItemCM onClick={handleItemClick} data={{ action: 'open' }}>
									<ListItem button >
										<Avatar>
											<InputIcon />
										</Avatar>
										<ListItemText primary={isFile ? "Abrir" : "Entrar"} />
									</ListItem>
								</MenuItemCM>


								{
									showCopyInUnity&&
									<MenuItemCM onClick={handleItemClick} data={{ action: 'copy' }}>
										<ListItem button >
											<Avatar>
												<FilterNone />
											</Avatar>
											<ListItemText primary="Copiar en unidad" />
										</ListItem>
									</MenuItemCM>
								}

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
	}
}

DynamicMenu.propTypes = {
	id: PropTypes.string.isRequired,
	trigger: PropTypes.shape({
		name: PropTypes.string.isRequired,
		onItemClick: PropTypes.func.isRequired,
		allowRemoval: PropTypes.bool
	}).isRequired
};

const ConnectedMenu = connectMenu("itemList")(withStyles(styles, { theme: true })(DynamicMenu))

@connect(state => {

	var toolBar = state.getIn(["explorer", "toolBar"]);
	var selection = state.getIn(["explorer", "selection"]);
	var online = state.getIn(["app", "online"])
	return { online: online, toolBar, filter: toolBar.get("filter"), isSelecteMode: selection.get("isSelecteMode") }
},mapActions(DIALOGS_ACTION.COPY))
@withMobileDialog()
@withStyles({
	avatar: {
		backgroundColor: "transparent",
	}
}, {
	withTheme: true
})
class DirectoryListVirtualize extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			filter: "",
			renamedialog: false,

			sortBy: "name",
			order: true //true = asc, false = desc
		}
		//window.fs = this

		store.dispatch({ type: "CURRENT_TYPE_EXPLORER", payload: { type: "folder" } })
	}

	componentWillUpdate() {
		//store.dispatch({type:"CURRENT_TYPE_EXPLORER",payload:{type:"folder"}})
	}

	handleItemEvent = (event, data) => {
		if (!this.props.online) return

		if (data.action == "checkInList") {
			if (data.checked) {
				store.dispatch({ type: "ADD_ITEM_SELECTION", payload: { item: data.item } })
			} else {
				store.dispatch({ type: "REMOVE_ITEM_SELECTION", payload: { item: data.item } })
			}
		}

		if (this.props.isSelecteMode) { return }

		if (data.action == "open") {
			const path = data.item.get("path");
			var newLocation = locationToData();
			newLocation.pathname = "/SC/open-share";
			newLocation.hash = path.replace(newLocation.spath, "");

			store.dispatch(push(newLocation))
		}
	}

	/**
	 * Manejador de acciones para menu contextual
	 */
	handleClickItemMenuContext = (e, data, target) => {

		if (data.action === 'download') {

            const dirData = this.props.data;
            var path = data.item.get("path");
			var owner = dirData.get("owner")
            var spath = dirData.get("spath");
            var subpath = path.replace(spath,"");
            download(owner,spath,subpath);
            //store.dispatch(APP_ACTIONS.OPEN_LITTLE_MSG.FUN("Descarga en proceso."));
			//DownloadManagerInstance.instance.addDownload(data.item)
			//console.error(data)
			return;
		}

		if (data.action === 'open') {
			const path = data.item.get("path");
			var newLocation = locationToData();
			newLocation.pathname = "/SC/open-share";
			newLocation.hash = path.replace(newLocation.spath, "");

			store.dispatch(push(newLocation))
			//store.dispatch(push("/SC/unidad#" + data.item.get("path")))
			//this.props.history.push("/SC/unidad#"+data.item.get("path"))
			//console.error(this.props.history,this.props.history.push,push)
			return
		}

		
		if (data.action === "copy") {

			const dirData = this.props.data;
	        var path = data.item.get("path");
			var owner = dirData.get("owner")
            var spath = dirData.get("spath");
            var subpath = path.replace(spath,"");
	        this.props.C_OPEN({owner,spath,subpath});
	        
		}

		
	}

	stateDownloadString(item) {
		var state = "";
		if (item.get("download") != undefined) {
			if (item.get("download") != "none") {
				state = item.get("download")
			}
		}

		return state != "" ? `, (${state})` : state;
	}

	sortBy(order, valueA, valueB) {

		var sort = 0;
		if(valueA == null ||  valueB == null){
			return -1
		}

		if (valueA < valueB) {
			sort = order ? -1 : 1
		}

		if (valueA > valueB) {
			sort = order ? 1 : -1
		}

		return sort;
	}

	setSortBy(sortBy, order = true) { this.setState({ sortBy, order }) }

	isActiveDirectory() {
		const { isSelecteMode } = this.props;
		const { online } = this.props;

		return !(isSelecteMode || !online)
	}


	IconByExt = ({ item }) => {
		const visCodeFile = isCodeFile(item.get("name"));
		const visTextFile = isTextFile(item.get("name"));
		const visImageFile = isImageFile(item.get("name"));
		const visVideoFile = isVideoFile(item.get("name"));
		const visAudioFile = isAudioFile(item.get("name"));
		const visPdfFile = isPdfFile(item.get("name"));

		return (
			<ListItemAvatar >
				<Avatar>
					{visTextFile && <TextIcon />}
					{visCodeFile && <CodeIcon />}
					{visImageFile && <PhotoIcon />}
					{(visVideoFile || visAudioFile) && <MusicVideoIcon />}
					{visPdfFile && <PictureAsPdfIcon />}

					{/**default*/
						(!visAudioFile && !visTextFile && !visCodeFile && !visImageFile && !visVideoFile && !visPdfFile) &&
						<InsertDriveFile />
					}
				</Avatar>
			</ListItemAvatar>
		)
	}

	_rowRenderer = ({ index, isScrolling, isVisible, key, style, dataToRender, isSelecteMode, online, fullScreen, activeDirectory,owner}) => {
		const { classes, data, history } = this.props;

		var item = dataToRender.get(index);
		const selectioned = item.get("selectioned", false);
		const isFile = item.get("file");
		const isHeader = item.get("header", false);
		item = item.set("top", style.top);
		item = item.set("owner",owner);
		return (
			<div key={key} style={style}>
				{isHeader &&

					<ListItem style={{ height: style.height }} divider >
						<ListItemText
							secondaryTypographyProps={{ noWrap: true, variant: "body2" }}
							primaryTypographyProps={{ noWrap: true, variant: "title" }}
							primary={item.get("name")}
							secondary={item.get("count")}
						/>
					</ListItem>

				}

				{!isHeader &&
					<ContextMenuTrigger
						//key={key}
						disabled={activeDirectory}
						onItemClick={this.handleClickItemMenuContext}
						item={item}
						name={item.get("name")}
						holdToDisplay={1000}
						collect={collect}

						id={"itemList"}>

						<ListItem disabled={!online} disableRipple={activeDirectory} key={key} button onClick={(e) => {
							this.handleItemEvent(e, { item, action: "open" })
							//history.push("/SC/unidad#"+item.get("path"))
						}}
						>
							{
								isSelecteMode &&
								<ListItemAvatar>
									<Avatar className={classes.avatar}>
										<Checkbox 
											icon={<RadioButtonUnchecked/>}
											checkedIcon={<CheckCircle/>}
											checked={selectioned} onChange={
												(e, c) => {
													this.handleItemEvent(e, { item, action: "checkInList", checked: c })
													return false
												}
											}/>
									</Avatar>
								</ListItemAvatar>
									
							}

							{/*Icon*/}
							{/**File*/
								!isSelecteMode && isFile &&
								<this.IconByExt item={item} />
							}

							{/**Folder*/
								!isSelecteMode && !isFile &&
								<ListItemAvatar>
									<Avatar>
										 <FolderIcon />
									</Avatar>
								</ListItemAvatar>
							}
							{/*Icon*/}




							{!isFile && //folder
								<ListItemText
									secondaryTypographyProps={{ noWrap: true, variant: "body2" }}
									primaryTypographyProps={{ noWrap: true, variant: "title" }}
									primary={item.get("name")}
									secondary={`${item.get("elements")} elementos (${filesize(item.get("size"))}) ${this.stateDownloadString(item)}`}
								/>}

							{isFile && //file
								<ListItemText
									secondaryTypographyProps={{ noWrap: true, variant: "body2" }}
									primaryTypographyProps={{ noWrap: true, variant: "title" }}
									primary={item.get("name")}
									secondary={`${filesize(item.get("size"))} ${this.stateDownloadString(item)}`}
								/>
							}

							{
								<ListItemSecondaryAction>
									{/*(item.get("shared", false) && item.get("file", true))*/false &&
										<IconButton aria-label="Compartido" color="primary" >
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

	_rowHeight = ({ index, fullScreen, dataToRender }) => {
		const item = dataToRender.get(index);

		if (item.get("header", false)) {
			return fullScreen ? 73 : 73;
		} else {
			return fullScreen ? 64 : 53
		}
	}

	_setRef = windowScroller => {
		this._windowScroller = windowScroller;
	};

	render() {
		const dirData = this.props.data;
        const path = dirData.get("path");
		const owner = dirData.get("owner")
        const spath = dirData.get("spath");
        const subpath = path.replace(spath,"");
		const { classes, data, history, fullScreen } = this.props;
		const { filter } = this.props
		const headerFolder = count => new ListI([new Map({ header: true, name: "Carpetas", count })])
		const headerFiles = count => new ListI([new Map({ header: true, name: "Archivos", count })])
		const sortby = this.props.toolBar.get("sortBy")
		const order = this.props.toolBar.get("order")

		var dataToRender = new ListI();
		var dataList = data.get("payload"); //de data a payload
		if (filter != "") {
			try {
				const regex = new RegExp(filter, "ig");
				dataList = dataList.filter(x => regex.test(x.get("name")));
			} catch (e) {
				alert("El criterio de busqueda es incorrector, por favor corregir.")
				//console.error(e)
			}
		}

		const groups = dataList.groupBy(x => x.get("file") ? "file" : "folder")

		var folders = groups.get("folder");


		if (folders != null) {
			folders = folders.sortBy((x) => x.get(sortby), (a, b) => this.sortBy(order, a, b));
			dataToRender = dataToRender.concat(headerFolder(folders.count()));
		} else {
			folders = new ListI();
		}
		dataToRender = dataToRender.concat(folders);


		var files = groups.get("file");
		if (files != null) {
			files = files.sortBy((x) => x.get(sortby), (a, b) => this.sortBy(order, a, b));
			dataToRender = dataToRender.concat(headerFiles(files.count()));
		} else {
			files = new ListI()
		}
		dataToRender = dataToRender.concat(files);

		const { isSelecteMode } = this.props;
		const { online } = this.props;

		const activeDirectory = !this.isActiveDirectory()
		return (

			<div id="listV">

				<ConnectedMenu />
				<WindowScroller
					ref={this._setRef}
					scrollElement={window}>
					{({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
						<div >
							{(folders.count() == 0 && files.count() == 0 && filter != "") &&
								<Grid style={{ height: "100%" }} direction="column" justify="center" alignItems="center" container>
									<Grid item>
										<Typography variant="title">Sin resultados para: {filter}</Typography>
									</Grid>
								</Grid>
							}
							<AutoSizer disableHeight>
								{({ width }) => (
									<List ref={registerChild} dense={!fullScreen}>
										<VList
											style={{ outline: "black" }}
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
											rowHeight={fullScreen ? 64 : 53}
											rowRenderer={({ index, isScrolling, isVisible, key, style }) =>
												this._rowRenderer({ index, isScrolling, isVisible, key, style, dataToRender, isSelecteMode, online, fullScreen, activeDirectory,owner })
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
		//window.eb = this
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
			this.setState({ hasError: false });
		} catch (error) {
			this.setState({ hasError: true });
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
export default (props) => (

	<ErrorBoundary>
		<DirectoryListVirtualize {...props} />
	</ErrorBoundary>

);
