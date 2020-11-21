import React from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import DashboardComponent from "./Components/DashboardComponent";
import InvestmentsComponent from "./Components/InvestmentsComponent";
import InvestmentComponent from "./Components/InvestmentComponent";
import MyDataComponent from "./Components/MyDataComponent";
import AboutComponent from "./Components/AboutComponent";

// Entry class of the program
class App extends React.Component {

	// Entry point of the program, set the routes
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={DashboardComponent} />
					<Route exact path="/dashboard" component={DashboardComponent} />
					<Route exact path="/investments" component={InvestmentsComponent} />
					<Route exact path="/investment" component={InvestmentComponent} />
					<Route exact path="/investment/:id" component={InvestmentComponent} />
					<Route exact path="/mydata" component={MyDataComponent} />
					<Route exact path="/about" component={AboutComponent} />
				</Switch>
			</Router>
		);
	}
}

export default App;
