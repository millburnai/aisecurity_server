import React, {Component} from 'react';
import {FixedSizeList} from "react-window";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {Switch} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import shadows from "@material-ui/core/styles/shadows";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import DoubleArrowOutlinedIcon from "@material-ui/icons/DoubleArrowOutlined";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import AlarmOutlinedIcon from "@material-ui/icons/AlarmOutlined";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import {green, red} from "@material-ui/core/colors";
import isEqual from 'lodash.isequal';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Box from "@material-ui/core/Box";
import axios from "axios";
import FlagIcon from "@material-ui/icons/Flag";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import CardActions from "@material-ui/core/CardActions";

const styles = theme => ({
    list: {
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: shadows[1],
    },
});

const useStyles = makeStyles(theme => ({
    yes: {
        // extend: '$icon',
        color: green[600],
        // marginRight: theme.spacing(1)
    },
    no: {
        // extend: '$icon',
        color: red[600],
        // marginRight: theme.spacing(1)
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1), //lmao idk
    },
    flaggableButton: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[600],
        '&:hover': {
            backgroundColor: red[800]
        }
    },
}));

function TransactionRow(props) {
    const {index, style, transactionList} = props;
    // console.log(transaction);
    const classes = useStyles();
    let [transaction, setTransaction] = React.useState(transactionList[index]); //any changes to transaction will not alter transactionList, but that shouldn't matter... right?
    const handleFlag = () => {
        const newFlagState = !transaction.flag;
        //how tf do i flag??
        axios.patch(`/v1/transactions/${transaction.id}/`, {
            flag: newFlagState
        });
        setTransaction({...transaction, flag: newFlagState});
    };
    return (
        <ListItem style={ style } key={ index }>
            <ListItemAvatar>
                <Avatar alt="Avatar" src={ '/static/img/' + transaction.student.pathToImage }/>
            </ListItemAvatar>
            <ListItemText primary={ transaction.student.name + ' #' + transaction.student.student_id }
                          secondary={ `Kiosk ${ transaction.kiosk_id } at ${ transaction.timestamp }` }/>
            {transaction.morning_mode ? <AlarmOutlinedIcon className={classes.icon} /> : (transaction.entering ? <React.Fragment><DoubleArrowOutlinedIcon className={classes.icon} /><MeetingRoomOutlinedIcon className={classes.icon} /></React.Fragment> : <React.Fragment><MeetingRoomOutlinedIcon className={classes.icon} /><DoubleArrowOutlinedIcon className={classes.icon} /></React.Fragment>)}
            { !transaction.flag ? <CheckIcon className={ clsx(classes.icon, classes.yes) }/> : <CloseIcon className={ clsx(classes.icon, classes.no) }/> }
            <Button onClick={handleFlag} variant="contained" className={clsx({[classes.flaggableButton]: !transaction.flag})}>
                {!transaction.flag ? "Flag" : "Unflag"}
                {!transaction.flag ? <FlagIcon className={ classes.rightIcon}/> : <ThumbUpIcon className={classes.rightIcon}/>}
            </Button>
        </ListItem>
    )
}

TransactionRow.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    transactionList: PropTypes.array.isRequired,
};

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.classes = this.props.classes;
        this.state = {
            transactions: [],
        };
    }

    getTransactions() {
        let params = {...this.props.parameters};
        for (let key in params) {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
                delete params[key];
            }
        }
        axios.get('/v1/transactions', {
            headers: {
                'Authorization': 'Bearer ' + window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token,
            },
            params: params
        }).then(function(transactions) {
            let history = transactions.data;
            history.map(i=>{
                i.timestamp = new Date(i.timestamp);
                if (i.student === null) {
                    i.student = {
                        student_id: i.entered_id,
                        name: "[Illegal Transaction]",
                        privilege_granted: false,
                        pathToImage: 'bad_profile.jpg'
                    }
                }
            });
            this.setState({...this.state, transactions: history.reverse()});
        }.bind(this))

    }

    componentDidMount() {
        this.getTransactions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!(prevProps.parameters && this.props.parameters && isEqual(prevProps.parameters, this.props.parameters)))
            this.getTransactions();
    }

    render() {
        return (
            <FixedSizeList
                className={ this.classes.list }
                height={ this.props.height }
                itemCount={ this.state.transactions.length }
                itemSize={ 60 }
                width={ this.props.width }
            >
                { props => <TransactionRow { ...props } transactionList={ this.state.transactions }/> }
            </FixedSizeList>
        );
    }
}

TransactionList.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionList);