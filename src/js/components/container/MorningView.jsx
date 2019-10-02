import React, {Component} from 'react';
import axios from 'axios';
import Box from "@material-ui/core/Box";
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
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import TransactionList from "../presentational/TransactionList.jsx";

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
    },
    iconButton: {
        margin: theme.spacing(1),
    },
});

class MorningView extends Component {
    constructor(props) {
        super(props);
        this.classes = this.props.classes;
        this.state = {};
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
            <Box  p={1} display="flex" flexDirection="column">
                <Box

                    display="flex"
                    justifyContent="center"
                    mx="auto"
                >
                    {/*<TextField*/}
                    {/*    className={this.classes.input}*/}
                    {/*    value={this.state.params.name}*/}
                    {/*    label="Name"*/}
                    {/*    margin="normal"*/}
                    {/*    // variant="outlined"*/}
                    {/*    onChange={this.handleChange('name')}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    className={this.classes.input}*/}
                    {/*    value={this.state.params.id}*/}
                    {/*    label="ID"*/}
                    {/*    margin="normal"*/}
                    {/*    type="number"*/}
                    {/*    onChange={this.handleChange('id')}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    className={this.classes.input}*/}
                    {/*    value={this.state.params.grade}*/}
                    {/*    label="Grade"*/}
                    {/*    margin="normal"*/}
                    {/*    type="number"*/}
                    {/*    onChange={this.handleChange('grade')}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    label="Privilege"*/}
                    {/*    select*/}
                    {/*    margin="normal"*/}
                    {/*    className={this.classes.input}*/}
                    {/*    value={this.state.params.privilege}*/}
                    {/*    onChange={this.handleChange('privilege')}>*/}
                    {/*    <MenuItem value={''}>*/}
                    {/*        <i>None</i>*/}
                    {/*    </MenuItem>*/}
                    {/*    <MenuItem value={true}>*/}
                    {/*        /!*<CheckIcon className={this.classes.yes}/>*!/*/}
                    {/*        Yes*/}
                    {/*    </MenuItem>*/}
                    {/*    <MenuItem value={false}>*/}
                    {/*        /!*<CloseIcon className={this.classes.no}/>*!/*/}
                    {/*        No*/}
                    {/*    </MenuItem>*/}
                    {/*</TextField>*/}

                </Box>
                <Box mx="auto" width={this.props.windowWidth * 0.9} display="flex" flexShrink={1} justifyContent="flex-end" flexDirection="row">
                    <IconButton href="/v1/download/transactions?morning_mode=1" target="_blank">
                        <CloudDownloadIcon/>
                    </IconButton>
                </Box>
                <TransactionList width={this.props.windowWidth * 0.9} height={500} parameters={{...this.state.params, morning_mode: 1}}/>
            </Box>
        );
    }
}

MorningView.propTypes = {
    classes: PropTypes.object.isRequired,
    windowHeight: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
};

export default windowSize(withStyles(styles)(MorningView));