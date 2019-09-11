import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import * as Icons from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";
import HistoryIcon from "@material-ui/icons/History";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import GavelIcon from "@material-ui/icons/Gavel";
import PeopleIcon from "@material-ui/icons/People";

import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import Divider from "@material-ui/core/Divider";

import PropTypes from 'prop-types';
import {Link, Redirect} from "react-router-dom";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    }
});

function SideNav(props) {
    const classes = useStyles();
    const [droppedDown, setDroppedDown] = React.useState(false);
    const [logOutEvent, setLogOutEvent] = React.useState(false); //AHHHHH
    useEffect(() => { if (logOutEvent) setLogOutEvent(false); });
    return (
        <div>
            <Drawer
                anchor="left"
                open={props.open}
                onClose={()=>props.setDrawerOpen(false)}>
                <div
                    className={classes.list}
                    role="presentation"
                    onClick={()=>props.setDrawerOpen(false)}
                    onKeyDown={()=>props.setDrawerOpen(false)}
                >
                    <List>
                        <Link to="/" className={classes.link}>
                            <ListItem button key="Home">
                                <ListItemIcon><HomeIcon/></ListItemIcon>
                                <ListItemText primary="Home"/>
                            </ListItem>
                        </Link>
                        <Link to="/history" className={classes.link}>
                            <ListItem button key="History">
                                <ListItemIcon><HistoryIcon/></ListItemIcon>
                                <ListItemText primary="History"/>
                            </ListItem>
                        </Link>
                        <ListItem button key="Tardies">
                            <ListItemIcon><HourglassEmptyIcon/></ListItemIcon>
                            <ListItemText primary="Tardies"/>
                        </ListItem>
                        <Link to="/students" className={classes.link}>
                            <ListItem button key="Students">
                                <ListItemIcon><PeopleIcon/></ListItemIcon>
                                <ListItemText primary="Students"/>
                            </ListItem>
                        </Link>
                        <ListItem button key="Audit Log">
                            <ListItemIcon><GavelIcon/></ListItemIcon>
                            <ListItemText primary="Audit Log"/>
                        </ListItem>
                    </List>
                    <Divider/>
                    {!logOutEvent ? <List>
                        <ListItem button
                                  onClick={
                                      ()=>window.gapi.auth2.getAuthInstance().signOut().then(()=>{
                                          setLogOutEvent(true);
                                      }) //surely window.gapi will be defined by the time this runs.... surely...
                                  }
                                  key="Log Out">
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <ListItemText primary="Log Out"/>
                        </ListItem>
                    </List> : <Redirect to="/login"/>}
                </div>
            </Drawer>
        </div>
    );
}

SideNav.propTypes = {
    setDrawerOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default SideNav;