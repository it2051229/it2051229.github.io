import React from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";
import NumberUtils from "../Entities/NumberUtils";

class DashboardComponent extends React.Component {

    // Initialize the dashboard
    constructor(props) {
        super(props);
        this.database = new Database();
    }

    // Display the dashboard
    render() {
        let stockTableRows = <tr>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
        </tr>

        let stockNames = this.database.getStockNames();

        // Build the table rows for the stocks
        if(stockNames.length > 0) {
            stockTableRows = stockNames.map((stockName) => {
                let sharesAcquired = 0;
                let sharesDisposed = 0;
                let totalCost = 0;

                let highestSharePrice = -1;
                let lowestSharePrice = -1;
                
                // For each stock calculate the total shares acquired, sold, and purchase cost
                this.database.getStockInsiders(stockName).forEach((insiderName) => {              
                    this.database.getInsiderTransactions(stockName, insiderName).forEach((transaction) => {
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
                });

                // Calculate the average cost per share
                let averageCost = totalCost / sharesAcquired;

                // Deduct the shares disposed
                sharesAcquired -= sharesDisposed;
                totalCost -= averageCost * sharesDisposed;

                // Recalculate the final average cost after disposal
                averageCost = sharesAcquired > 0 ? totalCost / sharesAcquired : 0;

                return (
                    <tr key={stockName} onClick={(e) => { window.location.href="#/stock/" + stockName; }}>
                        <td><strong>{ stockName }</strong></td>
                        <td>{ NumberUtils.formatCurrency(averageCost) }</td>
                        <td>{ NumberUtils.formatCurrency(highestSharePrice) }</td>
                        <td>{ NumberUtils.formatCurrency(lowestSharePrice) }</td>
                        <td>{ NumberUtils.formatWithCommas(sharesAcquired) }</td>
                    </tr>
                );
            });
        }

        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container>
                    <Row>
                        <Col md="12">
                            <h2>Dashboard</h2>
                            <p>
                                <Button variant="primary" href="#/transaction">Add Transaction</Button>{" "}
                                <Button variant="dark">Export Stocks to CSV File</Button>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Table responsive striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Stock</th>
                                        <th>Average Cost Per Share</th>
                                        <th>Highest Cost Per Share</th>
                                        <th>Lowest Cost Per Share</th>
                                        <th>Total Insider Shares</th>
                                    </tr>
                                </thead>
                                <tbody>{ stockTableRows }</tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default DashboardComponent;
