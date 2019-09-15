import React, {Component} from 'react';
import { FixedSizeList } from "react-window";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import windowSize from 'react-window-size';
import {withStyles} from "@material-ui/core/styles";
import {Switch} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import shadows from "@material-ui/core/styles/shadows";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import {green, red} from "@material-ui/core/colors";
import isEqual from 'lodash.isequal';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Box from "@material-ui/core/Box";
import axios from "axios";

const styles = theme => ({
    list: {
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: shadows[1],
    }
});

const useStyles = makeStyles(theme => ({
    yes: {
        color: green[600],
        marginRight: theme.spacing(1)
    },
    no: {
        color: red[600],
        marginRight: theme.spacing(1)
    }
}));

function StudentRow(props) {
    const { index, style, studentList } = props;
    const currentStudent = studentList[index];
    console.log(currentStudent);
    const classes = useStyles();
    return (
        <ListItem style={style} key={index}>
            <ListItemAvatar>
                <Avatar alt="Avatar" src={'/static/img/' + currentStudent.pathToImage}/>
            </ListItemAvatar>
            <ListItemText primary={currentStudent.name} secondary={`${currentStudent.student_id} • Grade ${currentStudent.grade}`}/>
            {currentStudent.privilege_granted ? <CheckIcon className={classes.yes}/> : <CloseIcon className={classes.no}/>}
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </ListItem>
    )
}

StudentRow.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    studentList: PropTypes.array.isRequired,
};

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.classes = this.props.classes;
        this.state = {
            students: [],
        };
    }

    getStudents() {
        let params = {...this.props.parameters};
        for (let key in params) {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
                delete params[key];
            }
        }
        axios.get("/v1/students", {
            headers: {
                'Authorization': 'Bearer ' + window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token,
            },
            params: params

        }).then(download=>{
            // console.log(download);
            const studentList = download.data;
            this.setState({...this.state, students: studentList});
        })
    }

    componentDidMount() {
        this.getStudents();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!(prevProps.parameters && this.props.parameters && isEqual(prevProps.parameters, this.props.parameters)))
            this.getStudents();
    }

    render() {
        return (
            <FixedSizeList
                className={this.classes.list}
                height={500}
                itemCount={this.state.students.length}
                itemSize={60}
                width={this.props.windowWidth * 0.6}
            >
                { props => <StudentRow {...props} studentList={this.state.students}/> }
            </FixedSizeList>
        );
    }
}

StudentList.propTypes = {
    windowWidth: PropTypes.number.isRequired,
    windowHeight: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
};

export default windowSize(withStyles(styles)(StudentList));