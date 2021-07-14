import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";

class DashboardComponent extends React.Component {

    // Initialize the dashboard
    constructor(props) {
        super(props);
    }

    // Display the dashboard
    render() {
        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container fluid>
                    <Row>
                        <Col md="12">
                            <h2>Dashboard</h2>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default DashboardComponent;
