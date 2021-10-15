//Taken from https://reacttraining.com/react-router/web/example/auth-workflow
//TODO: check for user permissions
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                window.gapi.auth2 && window.gapi.auth2.getAuthInstance() && window.gapi.auth2.getAuthInstance().isSignedIn.get() ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}
export default PrivateRoute;