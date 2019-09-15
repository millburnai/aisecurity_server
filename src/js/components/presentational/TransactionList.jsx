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

function TransactionRow(props) {
    const {index, style, transactionList} = props;
    const transaction = transactionList[index];
    // console.log(transaction);
    const classes = useStyles();
    let [student, setStudent] = React.useState();
    return (
        <ListItem style={ style } key={ index }>
            <ListItemAvatar>
                <Avatar alt="Avatar" src={ '/static/img/' + transaction.student.pathToImage }/>
            </ListItemAvatar>
            <ListItemText primary={ transaction.student.name }
                          secondary={ `Kiosk ${ transaction.kiosk_id } at ${ transaction.timestamp }` }/>
            { !transaction.flag ? <CheckIcon className={ classes.yes }/> : <CloseIcon className={ classes.no }/> }
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
            history.map(i=>{i.timestamp = new Date(i.timestamp)});
            this.setState({...this.state, transactions: history});
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