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
import StudentDialog from "../presentational/StudentDialog.jsx";

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
    }
    componentDidMount() {
        // axios.get('/v1/students').then(data=>this.setState({...this.state, data: data}));
    }
    render() {
        return (
            <Box  p={1}>
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
                {/*<StudentDialog onClose={()=>{}} open={true}/>*/}
                <StudentList parameters={{...this.state.params}}/>
            </Box>
        );
    }
}

StudentView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentView);