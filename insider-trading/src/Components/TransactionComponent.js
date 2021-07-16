import React from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";

// Form for adding a new transaction
class TransactionComponent extends React.Component {

    // Initialize the form
    constructor(props) {
        super(props);
        this.database = new Database();

        this.state = {
            "stock": "",
            "person": "",
            "date": "",
            "shares": "",
            "type": "BUY",
            "price": ""
        };
    }

    // Validate and add new transaction
    handleAddTransactionClick() {
        // Grab all entered data and sanitize them
        let stockName = this.state.stock.trim().toUpperCase();
        let insiderName = this.state.person.trim().toUpperCase();
        let date = this.state.date.trim();
        let shares = this.state.shares.trim().toUpperCase();
        let type = this.state.type.trim().toUpperCase();
        let price = this.state.price.trim().toUpperCase();

        // Validate that all fields are provided
        if(stockName === "" || insiderName === "" || date === "" || shares === "" || price === "" || type === "") {
            window.alert("All fields are required.");
            return;
        }

        // Validate the date
        date = Date.parse(date);

        if(isNaN(date)) {
            window.alert("Invalid date.");
            return;
        }

        // Validate the shares
        shares = parseInt(shares);

        if(isNaN(shares) || shares <= 0) {
            window.alert("Shares should be a positive numeric value.");
            return;
        }

        // Validate the price
        price = parseFloat(price);

        if(isNaN(price) || price <= 0) {
            window.alert("Price should be a positive decimal value.");
            return;
        }

        
        if(type === "BUY") {
            // Add the transaction to the database
            this.database.addTransaction(stockName, insiderName, date, shares, type, price);
        } else {
            // Check if the insider will go to negative shares, delete if it goes negative
            let totalShares = 0;

            this.database.getInsiderTransactions(stockName, insiderName).forEach(transaction => {
                if(transaction["type"] === "BUY")
                    totalShares += transaction["shares"];
                else
                    totalShares -= transaction["shares"];
            });

            totalShares -= shares;

            // Add the transaction as long as the insider has shares left, otherwise remove the insider
            if(totalShares <= 0)
                this.database.removeStockInsider(stockName, insiderName);
            else
                this.database.addTransaction(stockName, insiderName, date, shares, type, price);
        }

        // Clear the fields for new entry
        this.setState({
            "stock": "",
            "person": "",
            "date": "",
            "shares": "",
            "price": ""
        });

        window.alert("Transaction created.");
    }

    // Display the form
    render() {
        // Build the data list for stock names
        let stockNamesDataList = this.database.getStockNames().map((stockName) => {
            return (<option>{stockName}</option>);
        });

        // Build the data list for insider names from a stock
        let insidersDataList = this.database.getStockInsiders(this.state.stock).map((insider) => {
            return (<option>{insider}</option>);
        });

        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container>
                    <Row>
                        <Col md="6">
                            <h2>Add Insider Transaction</h2>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control list="stock-names" type="text" value={this.state.stock} onChange={(e) => { this.setState({"stock": e.target.value}) }} />
                                    <datalist id="stock-names">
                                        {stockNamesDataList}
                                    </datalist>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Person</Form.Label>
                                    <Form.Control list="insiders" type="text" value={this.state.person} onChange={(e) => { this.setState({"person": e.target.value}) }} />
                                    <datalist id="insiders">
                                        {insidersDataList}
                                    </datalist>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date of Transaction</Form.Label>
                                    <Form.Control type="date" value={this.state.date} onChange={(e) => { this.setState({"date": e.target.value}) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Shares</Form.Label>
                                    <Form.Control type="number" required value={this.state.shares} onChange={(e) => { this.setState({"shares": e.target.value}) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Transaction Type</Form.Label>
                                    <Form.Check label="Buy" value="Buy" name="transaction-type" type="radio" checked={this.state.type === "BUY"} onChange={(e) => { this.setState({"type": "BUY"}) }} />
                                    <Form.Check label="Sell" value="Sell" name="transaction-type" type="radio" checked={this.state.type === "SELL"} onChange={(e) => { this.setState({"type": "SELL"}) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price Per Share</Form.Label>
                                    <Form.Control type="number" step="any" placeholder="₱" value={this.state.price} onChange={(e) => { this.setState({"price": e.target.value}) }} />
                                </Form.Group>
                            </Form>
                            <p style={{textAlign: "right"}}>
                                <Button variant="dark" href="#/dashboard">Back</Button>{" "}
                                <Button variant="primary" onClick={(e) => { this.handleAddTransactionClick() }}>Add Transaction</Button>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default TransactionComponent;
