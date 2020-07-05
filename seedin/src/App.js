import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import disableBrowserBackButton from "disable-browser-back-navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import InvestmentsContainer from "./Components/InvestmentsContainer";
import MyDataContainer from "./Components/MyDataContainer";
import DashboardContainer from "./Components/DashboardContainer";
import AboutContainer from "./Components/AboutContainer";

// Entry class of the program
class App extends React.Component {

	// Initialize the main container
	constructor(props) {
		super(props);
		
		// The dashboard is the starting container
		this.state = { 
			"activeMenuName": "Dashboard",
			"navExpanded": false
		};
	}

	// Switch to another container
	handleMenuClick(newActiveMenuName) {
		window.scrollTo(0, 0);
		localStorage.setItem("investmentsTable.scrollY", 0);
		this.setState({ "activeMenuName": newActiveMenuName });
	}

	// Disable the back button of the browser
	componentDidMount() {
		disableBrowserBackButton();
	}

	// Entry point of the program
	render() {
		// Our containers and its mapping
		const menuNames = [ "Dashboard", "Investments", "My Data", "About" ];
		const menuContainers = [ <DashboardContainer />, <InvestmentsContainer />, <MyDataContainer />, <AboutContainer /> ]
		
		// Put the nav links in a list, also show an active state on the selected menu
		const menuNavLinks = menuNames.map((menuName) => {
			if(menuName === this.state.activeMenuName)
				return <Nav.Link eventKey={menuName} key={menuName} active onClick={(e) => this.handleMenuClick(menuName)}>{menuName}</Nav.Link>
			
			return <Nav.Link eventKey={menuName} key={menuName} onClick={(e) => this.handleMenuClick(menuName)}>{menuName}</Nav.Link>
		});

		// Find the active menu and the appropriate container to display
		let activeMenuContainer = menuContainers[menuNames.indexOf(this.state.activeMenuName)];	
		
		return (
			<>
				<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" fixed="top">
					<Navbar.Brand href="#home"><strong>My SeedIn Portfolio</strong></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							{ menuNavLinks }
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Container fluid>
					{activeMenuContainer}				
				</Container>
			</>
		);
	}
}

export default App;
