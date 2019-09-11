import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing * 2,
    },
    title: {
        flexGrow: 1,
    },
    menuDropdown: {
        flexGrow: 1,
        width: '100%',
        maxWidth: 200,
        padding: '0 15px',
        color: 'white',
        '& p': {
            color: 'white',
        }
    },
});

const menuOptions = [
    'Full Day',
    'Half Day',
    'Delayed Opening',
    'Custom',
    'Manual'
];

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.classes = props.classes;
        this.state = {checked: false,
            anchorEl: null,
            selectedIndex: 0
        };
    }

    render() {
        return (
            <div className={this.classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" onClick={()=>this.props.setDrawerOpen(true)} className={this.classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={this.classes.title}>
                            Kiosk Admin
                        </Typography>
                        <div className={this.classes.menuDropdown}>
                            <List component="nav" aria-label="Day Configuration">
                                <ListItem
                                    button
                                    aria-haspopup="true"
                                    aria-controls="lock-menu"
                                    aria-label="Day Configuration"
                                    onClick={(event)=>{this.setState({...this.state, anchorEl: event.currentTarget});}}
                                >
                                    <ListItemText primary="Day Configuration" secondary={menuOptions[this.state.selectedIndex]} />
                                </ListItem>
                            </List>
                            <Menu
                                id="lock-menu"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={Boolean(this.state.anchorEl)}
                                onClose={()=>{this.setState({...this.state, anchorEl: null});}}
                            >
                                {menuOptions.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        selected={index === this.state.selectedIndex}
                                        onClick={(event)=>{this.setState({...this.state, selectedIndex: index, anchorEl: null});}}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={(event, checked)=>{if(this.state.selectedIndex !== 4)alert("Manual Morning Mode Enabled!"); this.setState({...this.state, checked: checked, selectedIndex: 4}); this.props.morning(this.state.checked);}}
                                        value="checked"
                                        color="secondary"
                                    />
                                }
                                label="Morning Mode"
                            />
                        </FormGroup>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

NavBar.propTypes = {
    morning: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    setDrawerOpen: PropTypes.func.isRequired
};

export default withStyles(styles)(NavBar);