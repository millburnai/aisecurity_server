import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
const GOOGLE_BUTTON_ID = 'google-sign-in-button';
class GoogleSignIn extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (window.gapi.signin2)
            window.gapi.signin2.render(
                GOOGLE_BUTTON_ID,
                {
                    width: 200,
                    height: 50,
                    onsuccess: this.props.cb,
                    onfailure: this.props.cb,
                },
            );
    }
    render() {
        return (
            <div id={GOOGLE_BUTTON_ID}/>
        );
    }
}


export default withRouter(GoogleSignIn);