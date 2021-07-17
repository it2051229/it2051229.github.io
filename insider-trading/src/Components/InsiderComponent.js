import React from "react";
import { Table, Container, Button, Row, Col, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";
import NumberUtils from "../Entities/NumberUtils";

// View for drilled down information of an insider information on a stock
class InsiderComponent extends React.Component {

    // Initialize the view
    constructor(props) {
        super(props);

        // This view is only accessible if the stock name and insider name is provided in the URL
        if(!("stock" in props.match.params) || !("insider" in props.match.params))
            throw "Oh snap!";
        
        this.state = {
            "transactions": []
        };

        this.database = new Database();
        this.stockName = props.match.params.stock;
        this.insiderName = props.match.params.insider;
    }

    // Delete the current insider
    handleDeleteInsiderClick() {
        if(!window.confirm("Are you sure you want to delete this insider?"))
            return;
        
        this.database.removeStockInsider(this.stockName, this.insiderName);
        window.location.href = "#/stock/" + this.stockName;
    }

    // Delete a transaction
    handleTransactionCheckChange(event, transaction) {
        let transactions = this.state.transactions.slice();

        if(event.target.checked) {
            // Add selected transaction to list
            transactions.push(transaction);
        } else {
            // Remove selected transaction from list
            let index = -1;

            for(let i = 0; i < transactions.length; i++) {
                if(transactions[i] === transaction) {
                    index = i;
                    break;
                }
            }

            if(index >= 0)
                transactions.splice(index, 1);
        }

        this.setState({"transactions": transactions});
    }

    // Delete all selected transactions
    handleDeleteTransactionsClick() {
        if(this.state.transactions.length === 0 || !window.confirm("Are you sure you want to delete the selected transaction(s)?"))
            return;

        this.state.transactions.forEach((transaction) => {
            this.database.removeTransaction(this.stockName, this.insiderName, transaction);
        });

        // If the insider has no transactions anymore then delete it and move back to the socks page
        if(this.database.getInsiderTransactions(this.stockName, this.insiderName).length === 0) {
            this.database.removeStockInsider(this.stockName, this.insiderName);
            window.location.href = "#/stock/" + this.stockName;
            return;
        }

        this.setState({"transactions": []});        
    }

    // Check if transaction is checked
    isTransactionChecked(transaction) {
        for(let i = 0; i < this.state.transactions.length; i++)
            if(this.state.transactions[i] === transaction)
                return true;

        return false;
    }

    // Render the display
    render() {
        let sharesAcquired = 0;
        let sharesDisposed = 0;
        let totalCost = 0;
        let highestSharePrice = -1;
        let lowestSharePrice = -1;
        let transactions = this.database.getInsiderTransactions(this.stockName, this.insiderName);
        
        // Build the display for the insider's transactions
        transactions.forEach((transaction) => {
            if(transaction["type"] === "BUY") {
                sharesAcquired += transaction["shares"];
                totalCost += transaction["shares"] * transaction["price"];

                if(highestSharePrice === -1 || transaction["price"] > highestSharePrice)
                    highestSharePrice = transaction["price"];

                if(lowestSharePrice === -1 || transaction["price"] < lowestSharePrice)
                    lowestSharePrice = transaction["price"];
            } else {
                sharesDisposed += transaction["shares"];
            }
        });

        // Calculate the average cost per share
        let averageCost = totalCost / sharesAcquired;

        // Deduct the shares disposed
        sharesAcquired -= sharesDisposed;
        totalCost -= averageCost * sharesDisposed;

        // Recalculate the final average cost after disposal
        averageCost = sharesAcquired > 0 ? totalCost / sharesAcquired : 0;

        // Build the rows for the transactions in a table sorted by date in descending order
        transactions.sort((transactionA, transactionB) => {
            return transactionB["date"] - transactionA["date"];
        });

        let transactionTableRows = transactions.map((transaction) => {
            let date = new Date(transaction["date"]);
            
            return (
                <tr>
                    <td>
                        <Form.Check checked={ this.isTransactionChecked(transaction) } onChange={(e) => { this.handleTransactionCheckChange(e, transaction) }}></Form.Check>
                    </td>
                    <td>{ date.getFullYear()}-{date.getMonth() + 1}-{date.getDate() }</td> 
                    <td>{ NumberUtils.formatWithCommas(transaction["shares"]) }</td>
                    <td>{ transaction["type"]}</td>
                    <td>{ NumberUtils.formatCurrency(transaction["price"]) }</td>
                    <td>{ NumberUtils.formatCurrency(transaction["shares"] * transaction["price"]) }</td>
                </tr>
            )
        });

        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container>
                    <Row>
                        <Col md="12">
                            <h2>{ this.stockName } / { this.insiderName }</h2>
                            <p>
                                <Button variant="dark" onClick={(e) => { window.location.href="#/stock/" + this.stockName }}>Back</Button>{" "}
                                <Button variant="danger" onClick={(e) => { this.handleDeleteInsiderClick(); }}>Delete Insider</Button>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Table responsive striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Average Cost Per Share</th>
                                    <th>Highest Cost Per Share</th>
                                    <th>Lowest Cost Per Share</th>
                                    <th>Total Insider Shares</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={this.insiderName}>
                                    <td>{ NumberUtils.formatCurrency(averageCost) }</td>
                                    <td>{ NumberUtils.formatCurrency(highestSharePrice) }</td>
                                    <td>{ NumberUtils.formatCurrency(lowestSharePrice) }</td>
                                    <td>{ NumberUtils.formatWithCommas(sharesAcquired) }</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                    <Row>
                        <Col md="12">
                            <h2>Transactions</h2>
                            <p>
                                <Button variant="danger" onClick={(e) => { this.handleDeleteTransactionsClick(); }}>Delete Selected Transactions</Button>
                            </p>
                            <Table responsive striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th style={{width: "15px" }}></th>
                                        <th>Date</th>
                                        <th>Shares</th>
                                        <th>Type</th>
                                        <th>Price Per Share</th>
                                        <th>Market Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { transactionTableRows }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default InsiderComponent;
