import React from "react";
import { Table, Container, Button, Row, Col, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";
import NumberUtils from "../Entities/NumberUtils";

// View for drilled down information of a stock
class StockComponent extends React.Component {

    // Initialize the view
    constructor(props) {
        super(props);

        // This view is only accessible if the stock name parameter is provided in the URL
        if(!("stock" in props.match.params))
            throw "Oh snap!";

        this.database = new Database();
        
        this.state = {
            "fromDate": this.database.getFromDateFilter(),
            "toDate": this.database.getToDateFilter()
        };
        
        this.stockName = props.match.params.stock;
    }

    // Delete the stock then redirect back to home page
    handleDeleteStockClick() {
        if(!window.confirm("Are you sure you want to delete this stock?"))
            return;

        this.database.deleteStock(this.stockName);
        window.location.href = "#/dashboard";
    }

    // Export the transactions to a CSV file for this stock
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

        this.database.getStockInsiders(this.stockName).forEach((insiderName) => {
            this.database.getInsiderTransactions(this.stockName, insiderName).forEach((transaction) => {
                // Apply filter
                if(!(fromDate === null || toDate === null || (transaction["date"] >= fromDate && transaction["date"] <= toDate)))
                    return;

                let date = new Date(transaction["date"]);

                let csvLine = this.stockName;
                csvLine += "," + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                csvLine += "," + insiderName;
                csvLine += "," + transaction["shares"];
                csvLine += "," + transaction["type"];
                csvLine += "," + transaction["price"];

                csvData += csvLine + "\n";
            });
        });
        
        // Download the file
        let downloadLink = document.createElement("a");
        downloadLink.download = this.stockName.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "") + "-insider-trading.csv";
        downloadLink.href="data:text/plain;charset=utf-8," + encodeURIComponent(csvData);
        downloadLink.click();
    }

    // Render the display
    render() {
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
        
        // Initialize the display for the stock summary over-all
        let sharesAcquired = 0;
        let sharesDisposed = 0;
        let totalCost = 0;
        let highestSharePrice = -1;
        let lowestSharePrice = -1;

        let insiders = {};

        // For each stock calculate the total shares acquired, sold, and purchase cost
        this.database.getStockInsiders(this.stockName).forEach((insiderName) => {              
            this.database.getInsiderTransactions(this.stockName, insiderName).forEach((transaction) => {
                // Apply filter
                if(!(fromDate === null || toDate === null || (transaction["date"] >= fromDate && transaction["date"] <= toDate)))
                    return;

                if(!(insiderName in insiders)) {
                    insiders[insiderName] = {
                        "sharesAcquired": 0,
                        "sharesDisposed": 0,
                        "totalCost": 0,
                        "highestSharePrice": -1,
                        "lowestSharePrice": -1
                    };
                }

                let insider = insiders[insiderName];

                if(transaction["type"] === "BUY") {
                    // Over-all data
                    sharesAcquired += transaction["shares"];
                    totalCost += transaction["shares"] * transaction["price"];

                    if(highestSharePrice === -1 || transaction["price"] > highestSharePrice)
                        highestSharePrice = transaction["price"];
                    
                    if(lowestSharePrice === -1 || transaction["price"] < lowestSharePrice)
                        lowestSharePrice = transaction["price"];

                    // Specific insider data
                    insider["sharesAcquired"] += transaction["shares"];
                    insider["totalCost"] += transaction["shares"] * transaction["price"];

                    if(insider["highestSharePrice"] === -1 || transaction["price"] > insider["highestSharePrice"])
                        insider["highestSharePrice"] = transaction["price"];
                    
                    if(insider["lowestSharePrice"] === -1 || transaction["price"] < insider["lowestSharePrice"])
                        insider["lowestSharePrice"] = transaction["price"];
                } else {
                    // Over-all data
                    sharesDisposed += transaction["shares"];

                    // Specific insider data
                    insider["sharesDisposed"] += transaction["shares"];
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

        // Build the rows for the insider data
        let insiderTableRows = Object.keys(insiders).map((insiderName) => {
            // Calculate the average cost for an insider
            let insider = insiders[insiderName];
            let insiderAverageCost = insider["totalCost"] / insider["sharesAcquired"];

            // Deduct the shares disposed
            insider["sharesAcquired"] -= insider["sharesDisposed"];
            insider["totalCost"] -= insiderAverageCost * insider["sharesDisposed"];

            // Recalculate the final averagge cost after disposal
            insiderAverageCost = insider["sharesAcquired"] > 0 ? insider["totalCost"] / insider["sharesAcquired"] : 0;

            return (
                <tr key={insiderName} onClick={(e) => { window.location.href="#/insider/" + this.stockName + "/" + insiderName }}>
                    <td><strong>{insiderName}</strong></td>
                    <td>{ NumberUtils.formatCurrency(insiderAverageCost) }</td>
                    <td>{ NumberUtils.formatCurrency(insider["highestSharePrice"]) }</td>
                    <td>{ NumberUtils.formatCurrency(insider["lowestSharePrice"]) }</td>
                    <td>{ NumberUtils.formatWithCommas(insider["sharesAcquired"]) }</td>
                </tr>
            );
        });
        
        return (
            <>
                <NavigationBarComponent activeMenuName="Dashboard" />
                <Container>
                    <Row>
                        <Col md="12">
                            <h2>{ this.stockName }</h2>
                            <p>
                                <Button variant="dark" onClick={(e) => { window.location.href="#/dashboard" }}>Back</Button>{" "}
                                <Button variant="dark" onClick={(e) => { this.handleExportTransactionsClick(); }}>Export to CSV File</Button>{" "}
                                <Button variant="danger" onClick={(e) => { this.handleDeleteStockClick(); }}>Delete Stock</Button>
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
                                <tr key={this.stockName}>
                                    <td>{ NumberUtils.formatCurrency(averageCost) } </td>
                                    <td>{ NumberUtils.formatCurrency(highestSharePrice) }</td>
                                    <td>{ NumberUtils.formatCurrency(lowestSharePrice) }</td>
                                    <td>{ NumberUtils.formatWithCommas(sharesAcquired) }</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                    <Row>
                        <Col md="12">
                            <h2>Insiders</h2>
                            <Table responsive striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Average Cost Per Share</th>
                                        <th>Highest Cost Per Share</th>
                                        <th>Lowest Cost Per Share</th>
                                        <th>Total Shares</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { insiderTableRows }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default StockComponent;
