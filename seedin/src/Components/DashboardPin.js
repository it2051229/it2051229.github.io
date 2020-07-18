import React from "react";
import { Card, Form, FormControl, ProgressBar, Button } from "react-bootstrap";
import NumberUtils from "../Entities/NumberUtils";

// A dashboard pin is a pinned report
class DashboardPin extends React.Component {

    // The values for the dashboard pin will be taken from the props
    render() {
        var properties = this.props.pin["properties"];
        
        return (
            <Card bg="dark" text="white" style={{ marginBottom: "2rem" }}>
            <Card.Header><strong>{properties["fromDate"]} to {properties["toDate"]}</strong></Card.Header>
            <Card.Body>
                <Form.Group>
                    <Form.Label>Repayment Method</Form.Label>
                    <FormControl size="sm" readOnly value={properties["repaymentMethod"]} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Issuer</Form.Label>
                    <FormControl size="sm" readOnly value={properties["issuer"]} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Amount Invested / Projected Net ({ properties["gainPercent"] }%)</Form.Label>
                    <ProgressBar className="progress" now={ properties["gainPercent"] } max="20" />
                    <FormControl size="sm" readOnly value= { NumberUtils.formatCurrency(properties["amountInvested"]) + " / " + NumberUtils.formatCurrency(properties["projectedNetAmount"]) } />
                </Form.Group>
                <Form.Group>
                <Form.Label>Net Payout</Form.Label>
                    <ProgressBar className="progress" now={ properties["completedNetPayoutAmount"] } max={ properties["projectedNetAmount"] } />
                    <FormControl size="sm" readOnly value={ NumberUtils.formatCurrency(properties["completedNetPayoutAmount"]) + " out of " + NumberUtils.formatCurrency(properties["projectedNetAmount"]) } />
                </Form.Group>              
                <Form.Group>
                    <Form.Label>Net Earnings</Form.Label>
                    <ProgressBar className="progress" now={ properties["completedNetEarnings"] } max={ properties["netEarnings"] } />
                    <FormControl size="sm" readOnly value={ NumberUtils.formatCurrency(properties["completedNetEarnings"]) + " out of " + NumberUtils.formatCurrency(properties["netEarnings"]) } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Completed Projects</Form.Label>
                    <ProgressBar className="progress" now={ properties["completedProjects"] } max={ properties["numOngoingProjects"] } />
                    <FormControl size="sm" readOnly value={ properties["completedProjects"] + " out of " + properties["numOngoingProjects"] } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Net Interest Rate per annum</Form.Label>
                    <ProgressBar className="progress" now={ (properties["netInterestRateStats"]["avg"] * 100) } max="20" />
                    <FormControl size="sm" readOnly
                        value={ "Avg: " + (properties["netInterestRateStats"]["avg"] * 100).toFixed(2) + "%, "
                                    + "High: " + (properties["netInterestRateStats"]["high"] * 100).toFixed(2) + "%, "
                                    + "Low: " + (properties["netInterestRateStats"]["low"] * 100).toFixed(2) + "%" } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Net Interest Rate after Tenure</Form.Label>
                    <ProgressBar className="progress" now={ properties["netInterestRateAfterTenureStats"]["avg"] * 100 } max="20" />
                    <FormControl size="sm" readOnly 
                        value={ "Avg: " + (properties["netInterestRateAfterTenureStats"]["avg"] * 100).toFixed(2) + "%, "
                                    + "High: " + (properties["netInterestRateAfterTenureStats"]["high"] * 100).toFixed(2) + "%, "
                                    + "Low: " + (properties["netInterestRateAfterTenureStats"]["low"] * 100).toFixed(2) + "%" } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Project Tenure</Form.Label>
                    <ProgressBar className="progress" now={ properties["tenureStats"]["avg"] } max="12" />
                    <FormControl size="sm" readOnly 
                        value={ "Avg: " + parseInt(properties["tenureStats"]["avg"]) + " month(s), " 
                                    + "High: " + properties["tenureStats"]["high"] + " month(s), " 
                                    + "Low: " + properties["tenureStats"]["low"] + " month(s)" } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Subscription Days</Form.Label>
                    <ProgressBar className="progress" now={ properties["subscriptionDaysStats"]["avg"] } max="30" />
                    <FormControl size="sm" readOnly 
                        value={ "Avg: " + parseInt(properties["subscriptionDaysStats"]["avg"]) + " day(s), " 
                                    + "High: " + properties["subscriptionDaysStats"]["high"] + " day(s), "
                                    + "Low: " + properties["subscriptionDaysStats"]["low"] + " day(s)"} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Days before participating on another Project</Form.Label>
                    <ProgressBar className="progress" now={ properties["idleDaysStats"]["avg"] } max="30" />
                    <FormControl size="sm" readOnly 
                        value={ "Avg: " + parseInt(properties["idleDaysStats"]["avg"]) + " day(s), " 
                                    + "High: " + properties["idleDaysStats"]["high"] + " day(s), "
                                    + "Low: " + properties["idleDaysStats"]["low"] + " day(s)"} />
                </Form.Group>
            </Card.Body>
            <Card.Footer style={{ textAlign: "center" }}>
                <Button onClick={() => { this.props.removePinClick(this.props.pinNumber) }}>Remove</Button>
            </Card.Footer>
        </Card>
        );
    }
}

export default DashboardPin;
