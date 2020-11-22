import React from "react";
import { Navbar, Nav } from "react-bootstrap";

// A consistent header for all 
class NavigationBarComponent extends React.Component {

	// Initialize the header
	constructor(props) {
		super(props);
	}

	// Display the header
	render() {
		const menus = [ 
			{"name": "Dashboard", "link": "#dashboard"},
			{"name": "Investments", "link": "#investments"},
			{"name": "My Data", "link": "#mydata"},
			{"name": "About", "link": "#about"} 
		];

		// Put the nav links in a list, also show an active state on the selected menu
		const menuNavLinks = menus.map((menu) => {
			if(menu["name"] === this.props.activeMenuName)
				return (
					<Nav.Link href={menu["link"]} active eventKey={menu["name"]} key={menu["name"]}>
						{menu["name"]}
					</Nav.Link>
				);
			
			return (
				<Nav.Link href={menu["link"]} eventKey={menu["name"]} key={menu["name"]}>
					{menu["name"]}
				</Nav.Link>
			);
		});

		return (
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" fixed="top">
				<Navbar.Brand href="#/"><strong>Flint Portfolio</strong><sup>0.1.0</sup></Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						{ menuNavLinks }
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default NavigationBarComponent;
