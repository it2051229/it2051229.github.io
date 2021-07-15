import React from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";

// View for drilled down information of a stock
class StockComponent extends React.Component {

    // Initialize the view
    constructor(props) {
        super(props);

        // This view is only accessible if the stock name parameter is provided in the URL
        if(!("stock" in props.match.params))
            throw "Oh snap!";
    

        this.database = new Database();        
        this.stockName = props.match.params.stock;
    }

    // Delete the stock then redirect back to home page
    handleDeleteStockClick() {
        if(!window.confirm("Are you sure you want to delete this stock?"))
            return;

        this.database.deleteStock(this.stockName);
        window.location.href = "#/dashboard";
    }

    // Render the display
    render() {
        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container>
                    <Row>
                        <Col md="12">
                            <h2>{ this.stockName }</h2>
                            <p>
                                <Button variant="dark" onClick={(e) => { window.location.href="#/dashboard" }}>Back</Button>{" "}
                                <Button variant="danger" onClick={(e) => { this.handleDeleteStockClick(); }}>Delete Stock</Button>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default StockComponent;
