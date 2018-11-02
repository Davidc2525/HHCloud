
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteForever from '@material-ui/icons/DeleteForever';
import FilterNone from '@material-ui/icons/FilterNone';
import PropTypes from 'prop-types';
import React from "react";
import { connectMenu, ContextMenu, MenuItem as MenuItemCM } from "react-contextmenu";



const styles = theme => ({
	ContextMenu: {
		zIndex: theme.zIndex.tooltip,

		//backgroundColor: theme.palette.background.paper,
		padding: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 0,
		paddingLeft: theme.spacing.unit * 0,
		textAlign: 'start',

	},
	button: {
		marginLeft: theme.spacing.unit,
	},
});

function collect(props) {
	return props;
}
class DynamicMenu extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			confirms:{
				delete:{
					active:false,
				}
			}
		}
	}

	componentWillReceiveProps() {
		//var newState = this.state;
		//newState.confirms.delete.active = false;
		//this.setState(newState);
	}
	_onHide = _=>{
		var newState = this.state;
		newState.confirms.delete.active = false;
		this.setState(newState);
	}

	render(){

		const { id, trigger, classes } = this.props;
		const handleItemClick = trigger ? trigger.onItemClick : null;
		const deleteConfirm = this.state.confirms.delete.active
		return (
			<ContextMenu onHide={this._onHide} style={{ zIndex: "2000" }} id={id}>

				<Paper elevation={5} className={classes.ContextMenu}>

					{trigger && !trigger.disabled &&
						<div>
							<List >
								<MenuItemCM onClick={handleItemClick} data={{ action: 'copy' }}>
									<ListItem button >
										<Avatar>
											<FilterNone />
										</Avatar>
										<ListItemText primary="Copiar en mi unidad" />
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


								{!deleteConfirm&&
									<ListItem button onClick={_=>{
										var newState = this.state;
											newState.confirms.delete.active=true;
										this.setState(newState);
									}}>
										<Avatar>
											<DeleteForever />
										</Avatar>
										<ListItemText primary="Eliminar" />							            
									</ListItem>
								}

								{deleteConfirm&&
									
									<ListItem button title="Desea eliminar enlace?" style={{height:64}}>

										<Grid container>								 
											<Grid Item xs={6}>
												<Button variant="outlined" size="small" color="primary" className={classes.button} onClick={_=>{
													var newState = this.state;
														newState.confirms.delete.active=false;
													this.setState(newState);
												}}>
										         Cancelar
										        </Button>
												
											</Grid>
								     
											<Grid Item xs={6}>
												<MenuItemCM onClick={handleItemClick} data={{ action: 'delete' }}>
													<Button size="small" color="secondary" className={classes.button}>
												       Eliminar
												    </Button>
												</MenuItemCM>
											</Grid>
										</Grid>
									</ListItem>
								
								}

								{false&&
									<MenuItemCM onClick={handleItemClick} data={{ action: 'delete' }}>
									<ListItem button >
										<Avatar>
											<DeleteForever />
										</Avatar>
										<ListItemText primary="Eliminar" />
									</ListItem>
								</MenuItemCM>
								}
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

const contextId = "contextMenuSharedWithMe"
const ConnectedContextMenu = connectMenu(contextId)(withStyles(styles, { theme: true })(DynamicMenu))


export { ConnectedContextMenu, contextId, collect };
export default ConnectedContextMenu