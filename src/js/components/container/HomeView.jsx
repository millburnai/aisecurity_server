import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import GoogleSignIn from "../presentational/GoogleSignIn.jsx";

class HomeView extends Component {
    render() {
        return (
            window.gapi.auth2 && window.gapi.auth2.getAuthInstance() && window.gapi.auth2.getAuthInstance().isSignedIn.get() ?
                <Redirect to="/live"/>
                :
                <div>
                    lmao you gotta log in
                    <GoogleSignIn/>
                </div>
        );
    }
}

export default HomeView;