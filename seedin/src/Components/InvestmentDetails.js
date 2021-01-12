import React from "react";
import { Form, Table, Alert  } from "react-bootstrap";
import NumberUtils from "../Entities/NumberUtils";

// Investment details will show the effective interest rates and repayment schedules
class InvestmentDetails extends React.Component {

	// Display the calculated details of an investment
	render() {
        let netGainRate = "...";
        let netGainAmount = "...";
        let netTotalPayoutAmount = "...";
        let paymentSchedules = <tr><td>...</td><td>...</td><td>...</td></tr>
        let onHoldNotice = <></>

        // If an investment is provided then display the details
        if(this.props.investment !== null) {            
            netGainRate = (this.props.investment.calculateTenureInterestRate() * 100).toFixed(2) + "%";
            netGainAmount = this.props.investment.calculateNetGainAmount();
            netTotalPayoutAmount = this.props.investment.properties["investmentAmount"] + netGainAmount;
            paymentSchedules = this.props.investment.generateRepaymentSchedule();

            netGainAmount = NumberUtils.formatCurrency(netGainAmount);
            netTotalPayoutAmount = NumberUtils.formatCurrency(netTotalPayoutAmount);

            paymentSchedules = paymentSchedules.map((schedule) => {
                return <tr key={schedule["date"].toString()}>
                    <td>{ schedule["date"].toString() }</td>
                    <td>{ NumberUtils.formatCurrency(schedule["netInterestPayout"]) }</td>
                    <td>{ NumberUtils.formatCurrency(schedule["netPayout"]) }</td>
                </tr>
            })

            // Notice for on hold project
            if(this.props.investment.properties["status"] === "On Hold") {
                onHoldNotice = <Alert variant="warning">This project is <strong>On Hold</strong> and the <strong>repayment dates are just samples dates</strong>. </Alert>
            }
        }

		return(
			<>
				<h2>Investment Details</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Net Gain Rate after Tenure</Form.Label>
                        <Form.Control type="text" readOnly value={netGainRate} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Net Gain Amount after Tenure</Form.Label>
                        <Form.Control type="text" readOnly value={netGainAmount} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Total Net Payout after Tenure</Form.Label>
                        <Form.Control type="text" readOnly value={netTotalPayoutAmount} />
                    </Form.Group>
                </Form>
                { onHoldNotice }
                <Table responsive striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Payment Date</th>                        
                            <th>Net Interest</th>
                            <th>Net Payout</th>
                        </tr>
                    </thead>
                    <tbody>{ paymentSchedules }</tbody>
                </Table>
			</>
		);
	}
}

export default InvestmentDetails;
