import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

class NavigationBarComponent extends React.Component {

    // Initialize the header
    constructor(props) {
        super(props);
    }

    // Display the header
    render() {
        const menus = [
            {"name": "Dashboard", "link": "#dashboard"},
        ];

        // Put the nav links in a list and show which is the active state
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
				<Container fluid>
                    <Navbar.Brand href="#/"><strong>Insider Trading</strong><sup>0.1.0</sup></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            { menuNavLinks }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
			</Navbar>
        )
    }
}

export default NavigationBarComponent;
