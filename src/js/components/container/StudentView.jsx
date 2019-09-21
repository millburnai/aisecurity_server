import React, {Component} from 'react';
import axios from 'axios';
import Box from "@material-ui/core/Box";
import StudentList from "../presentational/StudentList.jsx";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import {green, red} from "@material-ui/core/colors";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import windowSize from 'react-window-size';
import StudentDialog from "../presentational/StudentDialog.jsx";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import isEqual from "lodash.isequal";

const styles = theme => ({
    yes: {
        color: green[600],
        // margin: theme.spacing(0),
        marginRight: theme.spacing(1)
    },
    no: {
        color: red[600],
        // margin: theme.spacing(0),
        marginRight: theme.spacing(1)
    },
    input: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }
});

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.classes = this.props.classes;
        this.state = {
            users: {

            },
            params: {
                name: '',
                student_id: '',
                privilege_granted: '',
                grade: '',
                sort: '',
            },
            selectedStudent: null,
            students: [],
        };
        this.handleChange = name => event => {
            // this.parameters[name] = event.target.value;
            // console.log(this.parameters);
            this.setState({
                ...this.state,
                params: {
                    ...this.state.params,
                    [name]: event.target.value
                }
            });
        };
        this.setStudentDialog = (student) => {
            this.setState((state, props) => {
                return {
                    selectedStudent: student === undefined ? null : student,
                }
            });
        };
        this.closeStudentDialog = () => {
            this.setStudentDialog(null);
        };
        this.getStudents = this.getStudents.bind(this);
    }
    getStudents() {
        let params = {...this.state.params};
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
        console.log(prevState.params, this.state.params, isEqual(prevState.params, this.state.params));
        if (!(prevState.params && this.state.params && isEqual(prevState.params, this.state.params))) {
            // console.log('eeeee');
            this.getStudents();
        }
    }

    render() {
        return (
            <Box  p={1} display="flex" flexDirection="column">
                <Box

                    display="flex"
                    justifyContent="center"
                    mx="auto"
                >
                    <TextField
                        className={this.classes.input}
                        value={this.state.params.name}
                        label="Name"
                        margin="normal"
                        // variant="outlined"
                        onChange={this.handleChange('name')}
                    />
                    <TextField
                        className={this.classes.input}
                        value={this.state.params.student_id}
                        label="ID"
                        margin="normal"
                        type="number"
                        onChange={this.handleChange('student_id')}
                    />
                    <TextField
                        className={this.classes.input}
                        value={this.state.params.grade}
                        label="Grade"
                        margin="normal"
                        type="number"
                        onChange={this.handleChange('grade')}
                    />
                    <TextField
                        label="Privilege"
                        select
                        margin="normal"
                        className={this.classes.input}
                        value={this.state.params.privilege_granted}
                        onChange={this.handleChange('privilege_granted')}>
                        <MenuItem value={''}>
                            <i>None</i>
                        </MenuItem>
                        <MenuItem value={1}>
                            {/*<CheckIcon className={this.classes.yes}/>*/}
                            Yes
                        </MenuItem>
                        <MenuItem value={0}>
                            {/*<CloseIcon className={this.classes.no}/>*/}
                            No
                        </MenuItem>
                    </TextField>

                </Box>
                <Box mx="auto" width={this.props.windowWidth * 0.6} display="flex" flexShrink={1} justifyContent="flex-end" flexDirection="row">
                    <IconButton href="/v1/download/students" target="_blank">
                        <CloudDownloadIcon/>
                    </IconButton>
                </Box>
                <StudentDialog onsave={this.getStudents} onClose={this.closeStudentDialog} open={this.state.selectedStudent !== null} student={this.state.selectedStudent}/>
                <StudentList height={500} setStudentDialog={this.setStudentDialog} width={this.props.windowWidth * 0.6} students={this.state.students}/>
            </Box>
        );
    }
}

StudentView.propTypes = {
    classes: PropTypes.object.isRequired,
    windowHeight: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
};

export default windowSize(withStyles(styles)(StudentView));