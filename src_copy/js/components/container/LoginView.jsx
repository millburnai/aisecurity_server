import React, {Component} from 'react';
import GoogleSignIn from "../presentational/GoogleSignIn.jsx";
import {Redirect} from "react-router-dom";

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = { redirectToReferrer: false };
        this.login = this.login.bind(this);
    }
    login() {
        this.setState({ ...this.state, redirectToReferrer: window.gapi.auth2 && window.gapi.auth2.getAuthInstance() && window.gapi.auth2.getAuthInstance().isSignedIn.get() }); //yeah i know you can just get this from the listener, whatever
    }

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (
            <div>
                <p>Please Log In!</p>
                <GoogleSignIn cb={this.login}/>
            </div>
        );
    }
}


export default LoginView;