import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import NavBar from '../presentational/NavBar.jsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import SideNav from "../presentational/SideNav.jsx";
import StudentView from "./StudentView.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import LiveView from "./LiveView.jsx";
import LoginView from "./LoginView.jsx";
import HomeView from "./HomeView.jsx";
import TransactionView from "./TransactionView.jsx";
import withStyles from "@material-ui/core/styles/withStyles";


function PageNotFound() {
    return (
        <div>
            <h3>404! Page not found!</h3>
        </div>
    )
}



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {sidenavOpen: false, gapiReady: false};
        let gapiPollerID = setInterval(()=>{
            if (window.gapi) {
                clearInterval(gapiPollerID);
                this.loadGAPI();
            }
        },100);
    }
    loadGAPI() {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init().then(()=> {
                this.setState({...this.state, gapiReady: true});
            });
        });
    }
    render() {
        return (
            <React.Fragment className={this.props.classes.root}>
                <CssBaseline />
                <Router>
                    <SideNav open={this.state.sidenavOpen} setDrawerOpen={isOpen => this.setState({...this.state, sidenavOpen: isOpen})}/>
                    <NavBar setDrawerOpen={isOpen => this.setState({...this.state, sidenavOpen: isOpen})} morning={()=>{}}/>
                    {
                        this.state.gapiReady ? <React.Fragment>
                            <div>
                                <Switch>
                                    <Route exact path="/" component={HomeView}/>
                                    <PrivateRoute exact path="/live" component={LiveView}/>
                                    <Route exact path="/login" component={LoginView}/>
                                    <PrivateRoute exact path="/students" component={StudentView}/>
                                    <PrivateRoute exact path="/history" component={TransactionView}/>
                                    <Route component={PageNotFound}/>
                                </Switch>
                            </div>
                        </React.Fragment> : <div>Loading...</div>
                    }
                </Router>
            </React.Fragment>
        )
    }
}

function Live() {
    return <h2>lmao ok this is live</h2>;
}

function Home() {
    return <h2>lmao ok this is home</h2>;
}


export default withStyles(styles)(App);