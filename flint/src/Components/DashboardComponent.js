import React from "react";
import { Container, Form, ProgressBar, FormControl, Row, Col, InputGroup, Alert, Modal, Button, Table } from "react-bootstrap";

import NavigationBarComponent from "./NavigationBarComponent";

import Database from "../Entities/Database";
import NumberUtils from "../Entities/NumberUtils";
import MyDate from "../Entities/MyDate";
import Investment from "../Entities/Investment";

class DashboardComponent extends React.Component {

	// Initialize the default stats
	constructor(props) {
		super(props);

		this.database = new Database();				
		this.investments = this.database.getInvestments();

		this.state = {
			"repaymentMethod": "All",
			"issuer": "All",
			"showInterestRateDistribution": false,
			"showTenureDistribution": false,
			"showInterestRateByTenureDistribution": false
		};
	}

	// Display dashboard
	render() {
		// Dashboard numbers
		var currentDate = MyDate.now();
		var numMaturedToday = 0;
		var numOnHold = 0;
		var onHoldAmount = 0;

		var numPayoutsToday = 0;
		var totalPayoutsToday = 0;

		this.amountInvested = 0;
		this.completedNetEarnings = 0;
		this.netEarnings = 0;
		this.projectedNetAmount = 0;
		this.completedNetPayoutAmount = 0;
		this.completedProjects = 0;
		this.gainPercent = 0;
		this.numOngoingProjects = 0;

		this.netInterestRateStats = { "avg": 0, "low": 0, "high": 0};
		this.tenureStats = { "avg": 0, "low": 0, "high": 0 };
		this.netInterestRateAfterTenureStats = { "avg": 0, "low": 0, "high": 0 };

		this.interestRateDistribution = {};
		this.tenureDistribution = {};
		this.interestRateTenureDistribution = {};

		var filteredInvestments = Investment.filterInvestmentsByRepaymentMethod(this.investments, this.state.repaymentMethod);
		console.log(filteredInvestments);
		
		// Sort the investments by project ID, the project ID is the date and that's how we can compute the idle days
		if(filteredInvestments.length > 0) {
			filteredInvestments.sort((investmentA, investmentB) => {
				return investmentA.properties["projectId"] - investmentB.properties["projectId"];
			});
		}

		var totalNetInterestRate = 0;	
		var totalTenure = 0;

		for(var i = 0; i < filteredInvestments.length; i++) {
			var investment = filteredInvestments[i];

			if(investment.properties["status"] === "On Hold") {
				numOnHold++;
				onHoldAmount += investment.properties["investmentAmount"];
				continue;
			}

			// Update the distribution of interest rates
			if(!(investment.properties["netInterestRate"] in this.interestRateDistribution)) {
				this.interestRateDistribution[investment.properties["netInterestRate"]] = { 
					"netInterestRate":  investment.properties["netInterestRate"],
					"frequency": 0
				};
			}

			this.interestRateDistribution[investment.properties["netInterestRate"]].frequency++;

			// Update the distribution of tenure
			if(!(investment.properties["tenure"] in this.tenureDistribution)) {
				this.tenureDistribution[investment.properties["tenure"]] = 1;
			} else {
				this.tenureDistribution[investment.properties["tenure"]]++;
			}

			// Update the distribution of interest rate and tenure
			var interestRateByTenure = (investment.properties["netInterestRate"] * 100).toFixed(2) + "% @ " + investment.properties["tenure"] + " month(s)";

			if(!(interestRateByTenure in this.interestRateTenureDistribution)) {
				this.interestRateTenureDistribution[interestRateByTenure] = 1;
			} else {
				this.interestRateTenureDistribution[interestRateByTenure]++;
			}

			// Update net interest stats
			var netInterestRate = investment.properties["netInterestRate"];

			if(i === 0 || netInterestRate > this.netInterestRateStats["high"])
				this.netInterestRateStats["high"] = netInterestRate;
			
			if(i === 0 || netInterestRate < this.netInterestRateStats["low"])
				this.netInterestRateStats["low"] = netInterestRate;

			// Update tenure stats
			var tenure = investment.properties["tenure"];

			if(i === 0 || tenure > this.tenureStats["high"])
				this.tenureStats["high"] = tenure;

			if(i === 0 || tenure < this.tenureStats["low"])
				this.tenureStats["low"] = tenure;


			totalNetInterestRate += netInterestRate;
			totalTenure += tenure;

			// Break down each investment schedule and include only those schedule that is exactly in the
			// date range, filters out months that
			var schedules = investment.generateRepaymentSchedule();
			
			if(schedules[schedules.length - 1]["date"].compareTo(currentDate) === 0)
				numMaturedToday++;

			if(schedules[schedules.length - 1]["date"].compareTo(currentDate) <= 0)
				this.completedProjects++;
			
			// If repayment method is balloon, there's no monthly investment.
			// So we put the whole investment amount.
			if(investment.properties["repaymentMethod"] === "Balloon")
				this.amountInvested += investment.properties["investmentAmount"];
			
			for(var j = 0; j < schedules.length; j++) {
				var schedule = schedules[j];

				if(schedule["date"].compareTo(currentDate) === 0) {
					numPayoutsToday++;
					totalPayoutsToday += schedule["netPayout"];
				}

				this.projectedNetAmount += schedule["netPayout"];
				
				// For equal repayment method, we consider the investment as divided as equal as well.
				if(investment.properties["repaymentMethod"] === "Equal")
					this.amountInvested += schedule["netPayout"] - schedule["netInterestPayout"];

				this.netEarnings += schedule["netInterestPayout"];

				if(schedule["date"].compareTo(currentDate) <= 0) {	
					this.completedNetEarnings += schedule["netInterestPayout"];
					this.completedNetPayoutAmount += schedule["netPayout"];
				}
			}
		}

		this.numOngoingProjects = filteredInvestments.length - numOnHold;
		this.gainPercent = (((this.projectedNetAmount - this.amountInvested) / this.amountInvested) * 100).toFixed(2);
		
		if(isNaN(this.gainPercent))
			this.gainPercent = 0;

		// Average interest rate calculation
		if(this.numOngoingProjects > 0) {
			this.netInterestRateStats["avg"] = totalNetInterestRate / this.numOngoingProjects;
			this.tenureStats["avg"] = totalTenure / this.numOngoingProjects;

			this.netInterestRateAfterTenureStats["avg"] = ((this.netInterestRateStats["avg"] / 12.0) * this.tenureStats["avg"]);
			this.netInterestRateAfterTenureStats["high"] = ((this.netInterestRateStats["high"] / 12.0) * this.tenureStats["high"]);
			this.netInterestRateAfterTenureStats["low"] = ((this.netInterestRateStats["low"] / 12.0) * this.tenureStats["low"]);
		}

		// Set any matured projects notifications
		let maturedProjectsNotification = <></>

		if(numMaturedToday > 0)
			maturedProjectsNotification = <Alert variant="success"><strong>Congratulations!</strong> You have <strong>{ numMaturedToday} project(s)</strong> that reached the maturity date today.</Alert>

		// Set the number of on hold projects notification
		let onHoldProjectsNotification = <></>

		if(numOnHold > 0)
			onHoldProjectsNotification = <Alert variant="warning">You have <strong>{ numOnHold } on hold project(s)</strong> with a total amount of <strong>{ NumberUtils.formatCurrency(onHoldAmount) }</strong></Alert>

		let payoutsTodayNotification = <></>

		if(numPayoutsToday > 0)
			payoutsTodayNotification = <Alert variant="success">You have <strong>{ numPayoutsToday } payout(s)</strong> today with a total amount of <strong>{ NumberUtils.formatCurrency(totalPayoutsToday) }</strong></Alert>

		return (
			<>
				<NavigationBarComponent activeMenuName="Dashboard" />
				<Container fluid>
					<Row>
						<Col md="12">
							<h2>Dashboard</h2>
						</Col>
					</Row>
					<Row>
						<Col md="12">{ maturedProjectsNotification }</Col>
						<Col md="12">{ onHoldProjectsNotification }</Col>
						<Col md="12">{ payoutsTodayNotification }</Col>
					</Row>
					<Row>
						<Col md="6">
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
					</Row>
					<Row>
						<Col md="6">
							<Form.Group>
								<Form.Label>Amount Invested / Projected Net</Form.Label>
								<ProgressBar className="progress" now={ this.gainPercent > 0 ? this.gainPercent: 0  } max="20" />
								<InputGroup className="mb-3">
									<FormControl readOnly value={ NumberUtils.formatCurrency(this.amountInvested) + " / " + NumberUtils.formatCurrency(this.projectedNetAmount) } />
									<InputGroup.Append>
										<InputGroup.Text>{ this.gainPercent }%</InputGroup.Text>
									</InputGroup.Append>								
								</InputGroup>
							</Form.Group>
							<Form.Group>
								<Form.Label>Net Payout</Form.Label>
								<ProgressBar className="progress" now={ this.completedNetPayoutAmount } max={ this.projectedNetAmount > 0 ? this.projectedNetAmount : 100 } />
								<FormControl readOnly value={ NumberUtils.formatCurrency(this.completedNetPayoutAmount) + " out of " + NumberUtils.formatCurrency(this.projectedNetAmount) } />
							</Form.Group>				
							<Form.Group>
								<Form.Label>Net Earnings</Form.Label>
								<ProgressBar className="progress" now={ this.completedNetEarnings } max={ this.netEarnings > 0 ? this.netEarnings : 100 } />
								<FormControl readOnly value={ NumberUtils.formatCurrency(this.completedNetEarnings) + " out of " + NumberUtils.formatCurrency(this.netEarnings) } />
							</Form.Group>
							<Form.Group>
								<Form.Label>Completed Projects</Form.Label>
								<ProgressBar className="progress" now={ this.completedProjects } max={ this.numOngoingProjects > 0 ? this.numOngoingProjects : 100 } />
								<FormControl readOnly value={ this.completedProjects + " out of " + this.numOngoingProjects } />
							</Form.Group>
						</Col>
						<Col md="6">
							<Form.Group>
								<Button onClick={ () => { this.setState({"showInterestRateDistribution": true}) } } variant="link" style={{ padding: 0, margin: 0 }} className="float-right"><small>Distribution</small></Button>
								<Form.Label>Net Interest Rate per annum</Form.Label>
								<ProgressBar className="progress" now={ (this.netInterestRateStats["avg"] * 100) } max="20" />
								<InputGroup className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text>Avg</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateStats["avg"] * 100).toFixed(2) + "%" } />
									<InputGroup.Prepend>
										<InputGroup.Text>High</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateStats["high"] * 100).toFixed(2) + "%" } />
									<InputGroup.Prepend>
										<InputGroup.Text>Low</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateStats["low"] * 100).toFixed(2) + "%" } />
								</InputGroup>							
							</Form.Group>
							<Form.Group>
								<Button onClick={ () => { this.setState({"showTenureDistribution": true}) } } variant="link" style={{ padding: 0, margin: 0 }} className="float-right"><small>Distribution</small></Button>
								<Form.Label>Project Tenure (months)</Form.Label>
								<ProgressBar className="progress" now={ this.tenureStats["avg"] } max="12" />
								<InputGroup className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text>Avg</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ parseInt(this.tenureStats["avg"]) } /> 
									<InputGroup.Prepend>
										<InputGroup.Text>High</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ this.tenureStats["high"] } />
									<InputGroup.Prepend>
										<InputGroup.Text>Low</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ this.tenureStats["low"] } />
								</InputGroup>
							</Form.Group>
							<Form.Group>
								<Button onClick={ () => { this.setState({"showInterestRateByTenureDistribution": true}) } } variant="link" style={{ padding:0, margin: 0 }} className="float-right"><small>Distribution</small></Button>
								<Form.Label>Net Interest Rate after Tenure</Form.Label>
								<ProgressBar className="progress" now={ this.netInterestRateAfterTenureStats["avg"] * 100 } max="20" />
								<InputGroup className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text>Avg</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateAfterTenureStats["avg"] * 100).toFixed(2) + "%" } />
									<InputGroup.Prepend>
										<InputGroup.Text>High</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateAfterTenureStats["high"] * 100).toFixed(2) + "%" } />
									<InputGroup.Prepend>
										<InputGroup.Text>Low</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl readOnly value={ (this.netInterestRateAfterTenureStats["low"] * 100).toFixed(2) + "%" } />
								</InputGroup>
							</Form.Group>		
						</Col>
					</Row>
					<Modal show={this.state.showInterestRateDistribution} onHide={(e) => { this.setState({"showInterestRateDistribution": false}) }}>
						<Modal.Header closeButton>
							<Modal.Title>Interest Rate Distribution</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Table responsive striped bordered hover variant="dark">
								<thead>
									<tr>
										<th className="align-middle">Net % p.a.</th>
										<th className="align-middle">Frequency</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.keys(this.interestRateDistribution).sort().map((netInterestRate) => {
											return <tr>
												<td>{ (this.interestRateDistribution[netInterestRate]["netInterestRate"] * 100).toFixed(2) }%</td>
												<td>{ (this.interestRateDistribution[netInterestRate]["frequency"]) }</td>
											</tr>
										})
									}
								</tbody>
							</Table>
						</Modal.Body>
					</Modal>
					<Modal show={this.state.showTenureDistribution} onHide={(e) => { this.setState({"showTenureDistribution": false}) }}>
						<Modal.Header closeButton>
							<Modal.Title>Tenure Distribution</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Table responsive striped bordered hover variant="dark">
								<thead>
									<tr>
										<th className="align-middle">Tenure</th>
										<th className="align-middle">Frequency</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.keys(this.tenureDistribution).sort(function(a, b) { return a - b }).map((tenure) => {
											return <tr>
												<td>{ tenure } month(s)</td>
												<td>{ this.tenureDistribution[tenure] }</td>
											</tr>
										})
									}
								</tbody>
							</Table>
						</Modal.Body>					
					</Modal>
					<Modal show={this.state.showInterestRateByTenureDistribution} onHide={(e) => { this.setState({"showInterestRateByTenureDistribution": false}) }}>
						<Modal.Header closeButton>
							<Modal.Title>Interest Rate x Tenure Distribution</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Table responsive striped bordered hover variant="dark">
								<thead>
									<tr>
										<th className="align-middle">Net Interest Rate</th>
										<th className="align-middle">Frequency</th>
									</tr>								
								</thead>
								<tbody>
									{
										Object.keys(this.interestRateTenureDistribution).sort(function(a, b) { return a.localeCompare(b) }).map((interestAtTenure) => {
											return <tr>
												<td>{ interestAtTenure }</td>
												<td>{ this.interestRateTenureDistribution[interestAtTenure] }</td>
											</tr>
										})
									}
								</tbody>
							</Table>
						</Modal.Body>
					</Modal>
				</Container>
			</>
		);
	}
}

export default DashboardComponent;
