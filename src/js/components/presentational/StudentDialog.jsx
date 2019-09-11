import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DialogActions} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    profilePicture: {
        minHeight: 100,
    },
});

function StudentDialog(props) {
    const classes = useStyles();
    const { onClose, value: valueProp, open, ...other } = props;
    function handleEntering() {
        //focus something? idk
    }
    function handleOk() {
        onClose();
    }
    return (
        <Dialog open={open}
                disableEscapeKeyDown
                onEntering={handleEntering}
                // dividers
                {...other}>
            <DialogTitle>Student</DialogTitle>
            <DialogContent>
                <Box display="flex">
                    <Box display="flex" flexDirection="row">
                        <img className={classes.profilePicture} src="static/img/CoindreauJavier.jpg"/>
                        <Box p={2} display="flex" flexGrow="1" flexDirection="column">
                            <Typography variant="h6">Name: David Shustin</Typography>
                            <Typography variant="subtitle1">ID: 12345</Typography>
                            <Typography variant="subtitle1">Privilege: True</Typography>
                            <Typography variant="subtitle1">Is out: False</Typography>
                        </Box>
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
}

StudentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.number,
    onClose: PropTypes.func.isRequired
};

StudentDialog.defaultProps = {
    id: null
};

export default StudentDialog;