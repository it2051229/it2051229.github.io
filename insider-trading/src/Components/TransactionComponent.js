import React from "react";
import { Container, Button, Row, Col, Form, Alert } from "react-bootstrap";
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

    // Import CSV file and add it to the database
    handleImportTransactionsClick(file) {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            try {
                let numTransactionsAdded = 0;
                
                fileReader.result.split("\r\n").forEach((line) => {
                    let tokens = line.split(",");
                    
                    try {
                        let i = 0;
                        let stockName = tokens[i++].trim().toUpperCase();                    
                        let date = Date.parse(tokens[i++].trim());
                        let insiderName = tokens[i++].trim().toUpperCase();
                        let shares = parseInt(tokens[i++].trim());
                        let type = tokens[i++].trim().toUpperCase();
                        let price = parseFloat(tokens[i++].trim());

                        if(stockName === "" 
                            || isNaN(date) 
                            || insiderName === "" 
                            || isNaN(shares) || shares <= 0
                            || (type !== "BUY" && type !== "SELL")
                            || isNaN(price) || price <= 0)
                            return;

                        this.database.addTransaction(stockName, insiderName, date, shares, type, price);
                        numTransactionsAdded++;
                    } catch(err) {
                    }
                });

                // Perform a clean-up by deleting those insiders who zeroed out in shares
                if(numTransactionsAdded > 0) {
                    this.database.getStockNames().forEach((stockName) => {
                        this.database.getStockInsiders(stockName).forEach((insiderName) => {
                            let insiderShares = 0;

                            this.database.getInsiderTransactions(stockName, insiderName).forEach((transaction) => {
                                if(transaction["type"] === "BUY")
                                    insiderShares += transaction["shares"];
                                else
                                    insiderShares -= transaction["shares"];
                            });

                            if(insiderShares <= 0)
                                this.database.removeStockInsider(stockName, insiderName);
                        });
                    });
                }

                window.alert(numTransactionsAdded + " transactions added.");
            } catch(err) {
                console.log(err);
                window.alert("Invalid file.");
            }
        };

        fileReader.readAsText(file);
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
                        <Col md="6">
                            <h2>or Import Transactions</h2>
                            <p>
                                Select a CSV (Comma Separated Values) file to import. This will not delete your old data but will add more to it.
                                Make sure your CSV file follows the appropriate format (example):
                            </p>
                            <Alert variant="dark">
                                <strong>Stock,Date,Person,Number of Shares,Trade,Price</strong><br />
                                DMC,2021-02-10,MARIA CRISTINA C. GOTIANUN,2599431,BUY,5.56<br />
                                DMC,2021-02-10,LUZ CONSUELO A. CONSUNJI,7798292,SELL,5.56 <br />
                                ...
                            </Alert>
                            <Form>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Control type="file" onChange={(e) => { this.handleImportTransactionsClick(e.target.files[0]) }} />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default TransactionComponent;
