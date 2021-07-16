import React from "react";
import { Table, Container, Button, Row, Col } from "react-bootstrap";
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
        // Initialize the display for the stock summary over-all
        let sharesAcquired = 0;
        let sharesDisposed = 0;
        let totalCost = 0;

        let insiders = {};

        // For each stock calculate the total shares acquired, sold, and purchase cost
        this.database.getStockInsiders(this.stockName).forEach((insiderName) => {              
            this.database.getInsiderTransactions(this.stockName, insiderName).forEach((transaction) => {
                if(!(insiderName in insiders)) {
                    insiders[insiderName] = {
                        "sharesAcquired": 0,
                        "sharesDisposed": 0,
                        "totalCost": 0       
                    };
                }

                let insider = insiders[insiderName];

                if(transaction["type"] === "BUY") {
                    // Over-all data
                    sharesAcquired += transaction["shares"];
                    totalCost += transaction["shares"] * transaction["price"];

                    // Specific insider data
                    insider["sharesAcquired"] += transaction["shares"];
                    insider["totalCost"] += transaction["shares"] * transaction["price"];
                } else {
                    // Over-all data
                    sharesDisposed += transaction["shares"];

                    // Specific insider data
                    insider["sharesDisposed"] += transaction["shares"];
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
                                <Button variant="danger" onClick={(e) => { this.handleDeleteStockClick(); }}>Delete Stock</Button>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Table responsive striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Average Cost Per Share</th>
                                    <th>Total Insider Shares</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={this.stockName}>
                                    <td>{ NumberUtils.formatCurrency(averageCost) } </td>
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
