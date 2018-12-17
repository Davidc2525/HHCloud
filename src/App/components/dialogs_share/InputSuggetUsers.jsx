import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import {fromJS,List} from "immutable";
import lodash from "lodash";

import LinearProgress from '@material-ui/core/LinearProgress';
import ApiInstance from "../../elements/API/v1/Api.js";

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import Avatar from '@material-ui/core/Avatar';


//const suggestionsUsers = fromJS([]);



function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}


function renderSuggestion2({ suggestionUser, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestionUser.label) > -1;
  const id = suggestionUser.get("id");
  return (
    <MenuItem
      {...itemProps}
      key={suggestionUser.get("id")}
      selected={isHighlighted}
      component={ListItem}
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
        <ListItemAvatar>
          <Avatar
            alt={`Avatar ${id}`}
            src={`${ApiInstance.instance.urlService}avatar?id=${id}&size=50x50`}
          />
        </ListItemAvatar>
        <ListItemText
            primaryTypographyProps={{variant:"title"}}
            primary={`${suggestionUser.get("lastName")} ${suggestionUser.get("firstName")} (${suggestionUser.get("email")})`}
            //secondary={`${owner.lastName} ${owner.firstName} (${owner.email})`}
        />
      
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}



class DownshiftMultiple extends React.Component {
  state = {
    inputValue: '',
    selectedItem: [],
    suggestionsUsers : fromJS([]),
    searching:false
  };

  handleKeyDown = event => {

    const status = this.props.createDialog.get("status");
    const cantEdit = (status == "ok" || status == "error")
    if(!cantEdit){
      return;
    }

    const {
      inputValue,
      selectedItem
    } = this.state;
    var data = this.props.createDialog.get("data");
    var selectedUsers = data.getIn(["shareWith", "users"],new List());
    if (selectedUsers.size && !inputValue.length && keycode(event) === 'backspace') {
      const lastUser = selectedUsers.last().toJS();

      this.props.DATA_SHARE_REMOVE_USER_BY_ID(lastUser.id)

    }
  };

  handleInputChangeToSearch = lodash.debounce(inputValue => {

        console.warn("Search:" + inputValue)
        this.setState({searching:true})
        var {
          suggestionsUsers
        } = this.state;
        if (inputValue.length) {
          ApiInstance.instance.callOperation("searchuser", {
            query: inputValue,
            thenCB: (x) => {
              const foundUsers = fromJS(x.users);
              foundUsers.forEach(user => {

                if (suggestionsUsers.findIndex(x => x.get("id") == user.get("id")) == -1) {
                  suggestionsUsers = suggestionsUsers.push(user)

                }
              })

              this.setState({
                suggestionsUsers
              })

              this.setState({searching:false});

            }
          });
        }else{
          this.setState({searching:false});
        }
      }, 1000, {
    maxWait: 2000
  })

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
    this.handleInputChangeToSearch(event.target.value)
  };



  handleChange = item => {
    let { selectedItem } = this.state;
     this.props.DATA_SHARE_ADD_USER(fromJS(item))

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = item => () => {
    const status = this.props.createDialog.get("status");
    const cantEdit = (status == "ok" || status == "error")
    if(!cantEdit){
      return;
    }
    this.props.DATA_SHARE_REMOVE_USER_BY_ID(item.id)
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
    });
  };

  getSuggestions = (inputValue) => {

    const data = this.props.createDialog.get("data");
    const selectedUsers = data.getIn(["shareWith", "users"],new List());
    let count = 0;

    var {suggestionsUsers} =this.state;

    return suggestionsUsers.filter(user => {
      const name = `${user.get("firstName")} ${user.get("lastName")} ${user.get("email")}`
      var keep =
        (!inputValue || name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
        count < 5;

      keep = (keep && selectedUsers.findIndex(x => x.get("id") === user.get("id")) === -1);
      keep = (keep && user.get("id")!=this.props.owner);
      if (keep) {
        count += 1;
      }

      return keep;
    });
  }

  renderInput = (inputProps) => {
  const { InputProps, classes, ref, ...other } = inputProps;
  const {searching} = this.state;
  return (
    <div><TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
    {searching&&<LinearProgress variant="query" />}
    </div>
  );
}

  render() {
    const { classes } = this.props;
    const { inputValue, selectedItem } = this.state;
    const data = this.props.createDialog.get("data");
    const selectedUsers = data.getIn(["shareWith","users"],new List()).toJS();

    const status = this.props.createDialog.get("status");
    const cantEdit = !(status == "ok" || status == "error")
    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedUsers}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {this.renderInput({
              disabled:cantEdit,
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedUsers.map(item => (
                  <Chip
                    avatar={
                      <Avatar
                        alt={`Avatar ${item.id}`}
                        src={`${ApiInstance.instance.urlService}avatar?id=${item.id}&size=50x50`}
                      />
                    }
                    key={item.id}
                    tabIndex={-1}
                    label={`${item.lastName} ${item.firstName} (${item.email})`}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: 'Seleccione con quien compartir',
                id: 'integration-downshift-multiple',
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {this.getSuggestions(inputValue2).map((suggestionUser, index) =>
                  renderSuggestion2({
                    suggestionUser,
                    index,
                    itemProps: getItemProps({ item: suggestionUser }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    //height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

function IntegrationDownshift(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      {/*<Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Search a country (start with a)',
                id: 'integration-downshift-simple',
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>*/}
      <DownshiftMultiple {...props} classes={classes} />
    </div>
  );
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
