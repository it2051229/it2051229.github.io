import React from "react";
import { Card, Form, FormControl, ProgressBar, Button } from "react-bootstrap";
import NumberUtils from "../Entities/NumberUtils";

// A dashboard pin is a pinned report
class DashboardPin extends React.Component {

    // The values for the dashboard pin will be taken from the props
    render() {
        var pin = this.props.pin;
                        
        return (
            <Card bg="dark" text="white" style={{ marginBottom: "2rem" }}>
            <Card.Header><strong>{pin.properties["fromDate"]} to {pin.properties["toDate"]}</strong></Card.Header>
            <Card.Body>
                <Form.Group>
                    <Form.Label>Repayment Method</Form.Label>
                    <FormControl size="sm" readOnly value={pin.properties["repaymentMethod"]} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Issuer</Form.Label>
                    <FormControl size="sm" readOnly value={pin.properties["issuer"]} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Amount Invested / Projected Net ({ pin.properties["gainPercent"] }%)</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["gainPercent"] } max="20" />
                    <FormControl size="sm" readOnly value= { NumberUtils.formatCurrency(pin.properties["amountInvested"]) + " / " + NumberUtils.formatCurrency(pin.properties["projectedNetAmount"]) } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Net Payout</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["netPayoutPercent"] } />
                    <FormControl size="sm" readOnly value={ NumberUtils.formatCurrency(pin.properties["completedNetPayoutAmount"]) + " out of " + NumberUtils.formatCurrency(pin.properties["projectedNetAmount"]) } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Average Project Gross / Net Interest Rate per annum</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["averageProjectInterestPercent"] } />
                    <FormControl size="sm" readOnly
                        value={ (pin.properties["averageGrossInterestRate"] * 100).toFixed(2) + "% / " + (pin.properties["averageNetInterestRate"] * 100).toFixed(2) + "%" } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Net Earnings</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["netEarningsPercent"] } />
                    <FormControl size="sm" readOnly value={ NumberUtils.formatCurrency(pin.properties["completedNetEarnings"]) + " out of " + NumberUtils.formatCurrency(pin.properties["netEarnings"]) } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Completed Projects</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["completedProjectsPercent"] } />
                    <FormControl size="sm" readOnly value={ pin.properties["completedProjects"] + " out of " + pin.properties["numOngoingProjects"] } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Average Project Tenure</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["averageProjectTenurePercent"] } />
                    <FormControl size="sm" readOnly value={ parseInt(pin.properties["averageTenure"]) + " month(s)" } />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Average Net Interest Rate after Tenure</Form.Label>
                    <ProgressBar className="progress" now={ pin.properties["averageNetInterestRateAfterTenure"] } max="20" />
                    <FormControl size="sm" readOnly value={ pin.properties["averageNetInterestRateAfterTenure"].toFixed(2) + "%" } />
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
