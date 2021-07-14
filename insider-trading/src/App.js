import React from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import DashboardComponent from "./Components/DashboardComponent";

// Entry class of the program
class App extends React.Component {

	// Entry point of the program, set the routes
	render() {
        return (
			<Router>
				<Switch>
					<Route exact path="/" component={DashboardComponent} />
					<Route exact path="/dashboard" component={DashboardComponent} />
				</Switch>
			</Router>
        );
    }
}

export default App;
