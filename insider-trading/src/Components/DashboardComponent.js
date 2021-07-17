import React from "react";
import { Col, Container, Row, Table, Button, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";
import NumberUtils from "../Entities/NumberUtils";

class DashboardComponent extends React.Component {

    // Initialize the dashboard
    constructor(props) {
        super(props);

        this.database = new Database();

        this.state = {
            "fromDate": this.database.getFromDateFilter(),
            "toDate": this.database.getToDateFilter()
        };
    }

    // Export the transactions to a CSV file for all stocks
    handleExportTransactionsClick() {
        let fromDate = null;
        let toDate = null;

        if(this.state.fromDate !== "") {
            fromDate = new Date(this.state.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            fromDate = fromDate.getTime();
        }

        if(this.state.toDate !== "") {
            toDate = new Date(this.state.toDate);
            toDate.setHours(0, 0, 0, 0);
            toDate = toDate.getTime();
        }
        
        // Build the CSV
        let csvData = "Stock,Date,Person,Number of Shares,Trade,Price\n";

        this.database.getStockNames().forEach((stockName) => {
            this.database.getStockInsiders(stockName).forEach((insiderName) => {
                this.database.getInsiderTransactions(stockName, insiderName).forEach((transaction) => {
                    // Apply filter
                    if(!(fromDate === null || toDate === null || (transaction["date"] >= fromDate && transaction["date"] <= toDate)))
                        return;

                    let date = new Date(transaction["date"]);

                    let csvLine = stockName;
                    csvLine += "," + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    csvLine += "," + insiderName;
                    csvLine += "," + transaction["shares"];
                    csvLine += "," + transaction["type"];
                    csvLine += "," + transaction["price"];

                    csvData += csvLine + "\n";
                });
            });
        });

        // Download the file
        let downloadLink = document.createElement("a");
        downloadLink.download = "insider-trading.csv";
        downloadLink.href="data:text/plain;charset=utf-8," + encodeURIComponent(csvData);
        downloadLink.click();
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
            let fromDate = null;
            let toDate = null;

            if(this.state.fromDate !== "") {
                fromDate = new Date(this.state.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                fromDate = fromDate.getTime();
            }

            if(this.state.toDate !== "") {
                toDate = new Date(this.state.toDate);
                toDate.setHours(0, 0, 0, 0);
                toDate = toDate.getTime();
            }
            
            stockTableRows = stockNames.map((stockName) => {
                let sharesAcquired = 0;
                let sharesDisposed = 0;
                let totalCost = 0;

                let highestSharePrice = -1;
                let lowestSharePrice = -1;
                
                // For each stock calculate the total shares acquired, sold, and purchase cost
                this.database.getStockInsiders(stockName).forEach((insiderName) => {              
                    this.database.getInsiderTransactions(stockName, insiderName).forEach((transaction) => {
                        // Apply filter
                        if(!(fromDate === null || toDate === null || (transaction["date"] >= fromDate && transaction["date"] <= toDate)))
                            return;

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

                if(sharesAcquired <= 0) {
                    highestSharePrice = 0;
                    lowestSharePrice = 0;
                }
                
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
                                <Button variant="dark" onClick={(e) => { this.handleExportTransactionsClick() }}>Export to CSV File</Button>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="2">
                            <Form.Group className="mb-3">
                                <Form.Text className="text-muted">From Date</Form.Text>
                                <Form.Control type="date" placeholder="yyyy-mm-dd" value={this.state.fromDate} 
                                    onChange={(e) => { 
                                        this.database.saveFromDateFilter(e.target.value); 
                                        this.setState({"fromDate": e.target.value});
                                    }} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-3">
                                <Form.Text className="text-muted">To Date</Form.Text>
                                <Form.Control type="date" placeholder="yyyy-mm-dd" value={this.state.toDate} 
                                    onChange={(e) => { 
                                        this.database.saveToDateFilter(e.target.value);
                                        this.setState({"toDate": e.target.value});
                                    }} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-3">
                                <br />
                                <Button variant="dark" onClick={(e) => {this.database.clearDateFilter(); this.setState({"fromDate": "", "toDate": ""}); }}>Reset</Button>
                            </Form.Group>                            
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
