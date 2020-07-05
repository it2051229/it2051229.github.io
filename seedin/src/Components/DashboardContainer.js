import React from "react";
import { Modal, Alert, Form, FormControl, Row, Col, InputGroup, ProgressBar } from "react-bootstrap";
import Database from "../Entities/Database";
import Investment from "../Entities/Investment";
import MyDate from "../Entities/MyDate";
import NumberUtils from "../Entities/NumberUtils";

// The dashboard contains all summary of projects
class DashboardContainer extends React.Component {

	// Initialize the default stats
	constructor(props) {
		super(props);

		this.investments = new Database().getInvestments();
		this.issuers = Investment.getIssuers(this.investments);

		// Initialize the earliest and latest dates
		var dates = Investment.getEarliestAndLatestInvestmentDates(this.investments);

		this.state = {
			"fromDate": dates !== null ? dates["earliest"].toString() : "",
			"toDate": dates !== null ? dates["latest"].toString() : "",
			"repaymentMethod": "All",
			"issuer": "All",
			"showNegativeGainExplanation": false
		};
	}

	render() {
		// Load the issuers
		let issuerOptions = this.issuers.map((issuer) => {
            return <option key={issuer}>{ issuer }</option>
		});
		
		var earliestDate = MyDate.toMyDate(this.state.fromDate);
		var latestDate = MyDate.toMyDate(this.state.toDate);

		// Dashboard numbers
		var currentDate = MyDate.now();
		var amountInvested = 0;
		var completedNetEarnings = 0;
		var netEarnings = 0;
		var projectedNetAmount = 0;
		var completedNetPayoutAmount = 0;
		var completedProjects = 0;
		var gainPercent = 0;
		var numMaturedToday = 0;

		var numOnHold = 0;
		var onHoldAmount = 0;

		// Progress bars
        var netEarningsPercent = 0;
        var netPayoutPercent = 0;
		var completedProjectsPercent = 0;
		
		var filteredInvestments = [];

		// Proceed only with the calculation on validate dates
		if(earliestDate != null && latestDate != null) {
			filteredInvestments = Investment.filterInvestmentsByDate(this.investments, earliestDate, latestDate);
			filteredInvestments = Investment.filterInvestmentsByRepaymentMethod(filteredInvestments, this.state.repaymentMethod);
			filteredInvestments = Investment.filterInvestmentsByIssuer(filteredInvestments, this.state.issuer);

			for(var i = 0; i < filteredInvestments.length; i++) {
				var investment = filteredInvestments[i];
	
				if(investment.properties["status"] === "On Hold") {
					numOnHold++;
					onHoldAmount += investment.properties["investmentAmount"];
					continue;
				}
	
				// Break down each investment schedule and include only those schedule that is exactly in the
				// date range, filters out months that
				var schedules = investment.generateRepaymentSchedule();
				
				if(schedules[schedules.length - 1]["date"].compareTo(currentDate) === 0)
					numMaturedToday++;
	
				if(schedules[schedules.length - 1]["date"].compareTo(currentDate) <= 0)
					completedProjects++;
				
				// If repayment method is balloon, there's no monthly investment.
				// So we put the whole investment amount.
				if(investment.properties["repaymentMethod"] === "Balloon")
					amountInvested += investment.properties["investmentAmount"];
				
				for(var j = 0; j < schedules.length; j++) {
					var schedule = schedules[j];
	
					if(schedule["date"].compareTo(earliestDate) >= 0 && schedule["date"].compareTo(latestDate) <= 0) {
						projectedNetAmount += schedule["netPayout"];
						
						// For equal repayment method, we consider the investment as divided as equal as well.
						if(investment.properties["repaymentMethod"] === "Equal")
							amountInvested += schedule["netPayout"] - schedule["netInterestPayout"];
	
						netEarnings += schedule["netInterestPayout"];
	
						if(schedule["date"].compareTo(currentDate) <= 0) {	
							completedNetEarnings += schedule["netInterestPayout"];
							completedNetPayoutAmount += schedule["netPayout"];
						}
					}
				}

				// Progress bar calculation
				netEarningsPercent = completedNetEarnings / netEarnings * 100;
				netPayoutPercent = completedNetPayoutAmount / projectedNetAmount * 100;
				completedProjectsPercent = completedProjects / filteredInvestments.length * 100;

				if(isNaN(netEarningsPercent))
					netEarningsPercent = 0;

				if(isNaN(netPayoutPercent))
					netPayoutPercent = 0;

				if(isNaN(completedProjectsPercent))
					completedProjectsPercent = 0;
			}
	
			gainPercent = (((projectedNetAmount - amountInvested) / amountInvested) * 100).toFixed(2);
	
			if(isNaN(gainPercent))
				gainPercent = 0;
		}

		// Set negative gain notification
		let negativeGainPercentNotification = <></>

		if(gainPercent < 0)
			negativeGainPercentNotification = <Alert className="clickable-alert" variant="info" onClick={(e) => { this.setState({"showNegativeGainExplanation": true}) }}>You got a <strong><u>negative gain</u></strong>.</Alert>

		// Set any matured projects notifications
		let maturedProjectsNotification = <></>

		if(numMaturedToday > 0)
			maturedProjectsNotification = <Alert variant="success"><strong>Congratulations!</strong> You have <strong>{ numMaturedToday} project(s)</strong> that reached the maturity date today.</Alert>

		// Set the number of on hold projects notification
		let onHoldProjectsNotification = <></>

		if(numOnHold)
			onHoldProjectsNotification = <Alert variant="warning">You have <strong>{ numOnHold } on hold project(s)</strong> with a total amount of <strong>{ NumberUtils.formatCurrency(onHoldAmount) }</strong></Alert>

		return (
			<>
				<Row>
					<Col md="12">
						<h2>Dashboard</h2>
					</Col>
				</Row>
				<Modal show={this.state.showNegativeGainExplanation} onHide={(e) => { this.setState({"showNegativeGainExplanation": false}) }} animation={false}>
					<Modal.Header closeButton>
						<Modal.Title>Negative Gain</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>
							You have a negative gain on the <strong>selected range of date</strong>{' '}
							because you have <strong>more balloon repayment projects than equal repayment projects</strong>.{' '}
							Unlike equal repayment projects, your invested funds in a balloon repayment project is{' '}
							<strong>not divided into months but summed as a whole</strong>. Some of the interests might have{' '}
							been paid which already lowered your negative gain. As we move closer to the maturity dates more interest earned will be released and{' '}
                			the negative gain will soon decrease and become positive <strong>once the tenure of the balloon projects have been reached</strong>.{' '}
							So within the range of dates you have selected, some of your <strong>balloon projects{' '}
							have not yet reached their tenure</strong> which resulted to a negative gain.
						</p>
					</Modal.Body>
				</Modal>
				<Row>
					<Col md="12">{ negativeGainPercentNotification }</Col>
					<Col md="12">{ maturedProjectsNotification }</Col>
					<Col md="12">{ onHoldProjectsNotification }</Col>
				</Row>
				<Row>
					<Col md="2">
						<Form.Group>
							<Form.Text className="text-muted">From Date</Form.Text>
							<Form.Control type="date" placeholder="yyyy-mm-dd" 
                                value={this.state.fromDate} onChange={(e) => { this.setState({"fromDate": e.target.value }) }}/>
						</Form.Group>
					</Col>
					<Col md="2">
						<Form.Group>
							<Form.Text className="text-muted">To Date</Form.Text>
							<Form.Control type="date" placeholder="yyyy-mm-dd" 
                                value={this.state.toDate} onChange={(e) => { this.setState({"toDate": e.target.value }) }}/>
						</Form.Group>
					</Col>
					<Col md="2">
						<Form.Group>
							<Form.Text className="text-muted">Repayment Method</Form.Text>
							<Form.Control as="select" custom
                                value={this.state.repaymentMethod} onChange={(e) => { this.setState({"repaymentMethod": e.target.value}) }}>
								<option>All</option>
								<option>Balloon</option>
								<option>Equal</option>
							</Form.Control>
						</Form.Group>
					</Col>
					<Col md="2">
						<Form.Group>
							<Form.Text className="text-muted">Issuer</Form.Text>
							<Form.Control as="select" custom
                                value={this.state.issuer} onChange={(e) => { this.setState({"issuer": e.target.value}) }}>
								<option>All</option>
                                { issuerOptions }
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col md="6">
						<Form.Group>
							<Form.Label>Amount Invested / Projected Net</Form.Label>
							<ProgressBar className="progress" now={ gainPercent } />
							<InputGroup className="mb-3">
								<FormControl size="lg" readOnly value= {NumberUtils.formatCurrency(amountInvested) + " / " + NumberUtils.formatCurrency(projectedNetAmount) } />
								<InputGroup.Append>
									<InputGroup.Text>{ gainPercent }%</InputGroup.Text>
								</InputGroup.Append>
							</InputGroup>
						</Form.Group>
						<Form.Group>
							<Form.Label>Net Payout</Form.Label>
							<ProgressBar className="progress" now={ netPayoutPercent } />
							<FormControl size="lg" readOnly value={ NumberUtils.formatCurrency(completedNetPayoutAmount) + " out of " + NumberUtils.formatCurrency(projectedNetAmount) } />
						</Form.Group>
					</Col>
					<Col md="6">
						<Form.Group>
							<Form.Label>Net Earnings</Form.Label>
							<ProgressBar className="progress" now={ netEarningsPercent } />
							<FormControl size="lg" readOnly value={ NumberUtils.formatCurrency(completedNetEarnings) + " out of " + NumberUtils.formatCurrency(netEarnings) } />
						</Form.Group>
						<Form.Group>
							<Form.Label>Completed Projects</Form.Label>
							<ProgressBar className="progress" now={ completedProjectsPercent } />
							<FormControl size="lg" readOnly value={ completedProjects + " out of " + filteredInvestments.length } />
						</Form.Group>
					</Col>
				</Row>
			</>
		);
	}
}

export default DashboardContainer;
