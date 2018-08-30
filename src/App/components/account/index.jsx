// @ts-check
import React from "react";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Account from "./Account.jsx"
import ChangePassword from "./ChangePassword.jsx"


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});
//@ts-ignore
@withStyles(styles, { withTheme: true })
class Index extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Datos" icon={<PersonPinIcon />} />
            <Tab label="Contraseña" icon={<VisibilityOffIcon />} />

          </Tabs>
        </AppBar>
        <SwipeableViews
          //axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer><Account /></TabContainer>
          <TabContainer><ChangePassword /></TabContainer>

        </SwipeableViews>

      </div>
    );
  }
}

export default Index