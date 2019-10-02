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
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    profilePicture: {
        minHeight: 100,
    },
    rightAlignButton: {
        marginLeft: 'auto',
    },
    progress: {
        margin: theme.spacing(4),
    }
}));
// TODO: Student dialog editability toggle?
function StudentDialog(props) {
    const classes = useStyles();
    console.log(props);
    const { onClose, value: valueProp, student: initialStudent, open, ...other } = props;
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState(initialStudent)
    useEffect(() => {
        setEditing(false);
        setStudent(props.student);
    }, [props.student])
    function handleEntering() {
        //focus something? idk
    }
    function handleOk() {
        onClose();
    }
    async function save() {
        //save results
        setSaving(true);
        try {
            await axios.put(`/v1/students/${ student.student_id }/`, {
                ...student
            }, {
                headers: {
                    'Authorization': 'Bearer ' + window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
                }
            });
        } catch (e) {
            alert('Unable to save student changes.');
        }
        setSaving(false);
        setEditing(false);
        props.onsave();
    }
    const handleChange = attr => event => {
        setStudent({...student, [attr]: event.target.value});
    };
    function EditableAttribute(variant, label, attr, type) {
        //this is horrible i dont even know why i chose to do it like this
        return !editing ? (
            <Typography variant={variant}>{`${label}: ${typeof student[attr] === 'boolean' ? ['No','Yes'][+student[attr]] : student[attr]}`}</Typography>
        ) : (
            type === 'checkbox' ? (
                <FormControlLabel control={
                    <Checkbox
                        value={ attr }
                        checked={ student[attr] }
                        onChange={ event => setStudent({...student, [attr]: event.target.checked}) }
                    />
                } label={label} />
            ) : (
                <TextField
                    label={label}
                    value={student[attr]}
                    onChange={handleChange(attr)}
                    margin="normal"
                    type={type}
                />
            )
        )
    }
    let editStatus;
    if (!saving) {
        if (!editing) {
            editStatus = <Button onClick={ () => setEditing(true) } color="">Edit</Button>
        } else {
            editStatus = <Button onClick={ save } color="">Save</Button>
        }
    }
    return (
        <Dialog open={open}
                disableEscapeKeyDown
                onEntering={handleEntering}
                // dividers
                {...other}>
            <DialogTitle>Student</DialogTitle>
            <DialogContent>
                {
                    /*god forgive me for this monstrosity of a ternary expression*/
                    !saving ? (student != null ? (
                    <Box display="flex">
                        <Box display="flex" flexDirection="row">
                            <img className={classes.profilePicture} src={`static/img/${student.pathToImage}`}/>
                            <Box p={2} display="flex" flexGrow="1" flexDirection="column">
                                {EditableAttribute('h6', 'Name', 'name', '')}
                                <Typography variant="subtitle1">{`ID: ${ student.student_id }`}</Typography>
                                {EditableAttribute('subtitle1', 'Privilege', 'privilege_granted', 'checkbox')}
                                <Typography variant="subtitle1">{`In School: ${student.in_school ? "Yes" : "No"}`}</Typography>
                            </Box>
                        </Box>

                    </Box>
                    ) : (
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h6">No Student Chosen</Typography>
                    </Box>
                    )) : (
                    <Box display="flex" flexDirection="row" justifyContent="center">
                        <CircularProgress className={classes.progress}/>
                    </Box>
                    )
                }
            </DialogContent>
            <DialogActions>
                {editStatus}
                <Button onClick={handleOk} color={!editing ? "primary" : "secondary"}>{ !editing ? 'OK' : 'Cancel' }</Button>
            </DialogActions>
        </Dialog>
    );
}

StudentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    student: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onsave: PropTypes.func, //This creates a warning because dialog tries to pass it down to child divs and stuff. As far as I can tell, that doesn't matter.
};

StudentDialog.defaultProps = {
    id: null,
    onsave: ()=>{}
};

export default StudentDialog;