import React from "react";
import { InputGroup, Card, Form, FormControl, ProgressBar, Button } from "react-bootstrap";
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
                    <Form.Label>Amount Invested / Projected Net</Form.Label>
                    <ProgressBar className="progress" now={ properties["gainPercent"] } max="20" />
                    <InputGroup size="sm" className="mb-3">
                        <FormControl readOnly value= { NumberUtils.formatCurrency(properties["amountInvested"]) + " / " + NumberUtils.formatCurrency(properties["projectedNetAmount"]) } />
                        <InputGroup.Append>
                            <InputGroup.Text>{ properties["gainPercent"] }%</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
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
                    <Form.Label>Gross Interest Rate per annum</Form.Label>
                    <ProgressBar className="progress" now={ (properties["grossInterestRateStats"]["avg"] * 100) } max="20" />
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Avg</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateStats"]["avg"] * 100).toFixed(2) + "%" } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>High</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateStats"]["high"] * 100).toFixed(2) + "%" } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>Low</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateStats"]["low"] * 100).toFixed(2) + "%" } />
                    </InputGroup>							
                </Form.Group>
                <Form.Group>
                    <Form.Label>Gross Interest Rate after Tenure</Form.Label>
                    <ProgressBar className="progress" now={ properties["grossInterestRateAfterTenureStats"]["avg"] * 100 } max="20" />
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Avg</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateAfterTenureStats"]["avg"] * 100).toFixed(2) + "%" } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>High</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateAfterTenureStats"]["high"] * 100).toFixed(2) + "%" } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>Low</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ (properties["grossInterestRateAfterTenureStats"]["low"] * 100).toFixed(2) + "%" } />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Project Tenure (months)</Form.Label>
                    <ProgressBar className="progress" now={ properties["tenureStats"]["avg"] } max="12" />
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Avg</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ parseInt(properties["tenureStats"]["avg"]) } /> 
                        <InputGroup.Prepend>
                            <InputGroup.Text>High</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["tenureStats"]["high"] } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>Low</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["tenureStats"]["low"] } />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Subscription Length (days)</Form.Label>
                    <ProgressBar className="progress" now={ properties["subscriptionDaysStats"]["avg"] } max="30" />
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Avg</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ parseInt(properties["subscriptionDaysStats"]["avg"]) } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>High</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["subscriptionDaysStats"]["high"] } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>Low</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["subscriptionDaysStats"]["low"] } />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Days before participating on another project</Form.Label>
                    <ProgressBar className="progress" now={ properties["idleDaysStats"]["avg"] } max="30" />
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Avg</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ parseInt(properties["idleDaysStats"]["avg"]) } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>High</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["idleDaysStats"]["high"] } />
                        <InputGroup.Prepend>
                            <InputGroup.Text>Low</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl readOnly value={ properties["idleDaysStats"]["low"] } />
                    </InputGroup>
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
