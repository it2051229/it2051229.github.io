import React from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import DashboardComponent from "./Components/DashboardComponent";
import TransactionComponent from "./Components/TransactionComponent";
import StockComponent from "./Components/StockComponent";
import InsiderComponent from "./Components/InsiderComponent";
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
					<Route exact path="/transaction" component={TransactionComponent} />
					<Route exact path="/stock/:stock" component={StockComponent} />
					<Route exact path="/insider/:stock/:insider" component={InsiderComponent} />
					<Route exact path="/about" component={AboutComponent} />
				</Switch>
			</Router>
        );
    }
}

export default App;
