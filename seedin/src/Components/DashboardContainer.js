import React from "react";
import { Table, Button, ButtonGroup, Modal, Alert, Form, FormControl, Row, Col, InputGroup, ProgressBar } from "react-bootstrap";
import Database from "../Entities/Database";
import Investment from "../Entities/Investment";
import MyDate from "../Entities/MyDate";
import NumberUtils from "../Entities/NumberUtils";
import DashboardPin from "./DashboardPin"
import Pin from "../Entities/Pin";

// The dashboard contains all summary of projects
class DashboardContainer extends React.Component {

	// Initialize the default stats
	constructor(props) {
		super(props);

		this.database = new Database();
				
		this.investments = this.database.getInvestments();
		this.issuers = Investment.getIssuers(this.investments);

		// Initialize the earliest and latest dates
		var dates = Investment.getEarliestAndLatestInvestmentDates(this.investments);

		this.state = {
			"fromDate": dates !== null ? dates["earliest"].toString() : "",
			"toDate": dates !== null ? dates["latest"].toString() : "",
			"repaymentMethod": "All",
			"issuer": "All",
			"showNegativeGainExplanation": false,
			"showPinReportHelp": false,
			"showInterestRateDistribution": false,
			"showTenureDistribution": false,
			"showInterestRateByTenureDistribution": false,
			"pins": this.database.getPins()
		};

		this.handleRemovePinClick = this.handleRemovePinClick.bind(this);
	}

	// Create a new dashboard pin
	handleCreatePinClick() {
		var earliestDate = MyDate.toMyDate(this.state.fromDate);
		var latestDate = MyDate.toMyDate(this.state.toDate);

		if(earliestDate == null || latestDate == null || earliestDate.compareTo(latestDate) > 0) {
			window.alert("Pick a sensible date.");
			return;
		}

		var pin = new Pin(
			this.state.fromDate,
			this.state.toDate,
			this.state.repaymentMethod,
			this.state.issuer,
			this.amountInvested,
			this.completedNetEarnings,
			this.netEarnings,
			this.projectedNetAmount,
			this.completedNetPayoutAmount,
			this.completedProjects,
			this.gainPercent,
			this.numOngoingProjects,
			this.grossInterestRateStats,
			this.tenureStats,
			this.grossInterestRateAfterTenureStats,
			this.subscriptionDaysStats,
			this.idleDaysStats
		);
		
		this.database.addPin(pin);
		this.setState({"pins": this.database.getPins()});
	}

	// Handle the removal of a pin from the dashboard
	handleRemovePinClick(pinNumber) {
		this.database.deletePin(pinNumber - 1);		
		this.setState({"pins": this.database.getPins()});
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
		var numMaturedToday = 0;

		var numOnHold = 0;
		var onHoldAmount = 0;

		var numPayoutsToday = 0;
		var totalPayoutsToday = 0;
		var totalSubscriptionDays = 0;

		this.amountInvested = 0;
		this.completedNetEarnings = 0;
		this.netEarnings = 0;
		this.projectedNetAmount = 0;
		this.completedNetPayoutAmount = 0;
		this.completedProjects = 0;
		this.gainPercent = 0;
		this.numOngoingProjects = 0;
		
		this.grossInterestRateStats = { "avg": 0, "low": 0, "high": 0};
		this.tenureStats = { "avg": 0, "low": 0, "high": 0 };
		this.grossInterestRateAfterTenureStats = { "avg": 0, "low": 0, "high": 0 };
		this.subscriptionDaysStats = { "avg": 0, "low": 0, "high": 0 };
		this.idleDaysStats = { "avg": 0, "low": 0, "high": 0 };

		this.interestRateDistribution = {};
		this.tenureDistribution = {};
		this.interestRateTenureDistribution = {};

		var filteredInvestments = [];

		// Proceed only with the calculation on validate dates
		if(earliestDate != null && latestDate != null && earliestDate.compareTo(latestDate) <= 0) {
			filteredInvestments = Investment.filterInvestmentsByDate(this.investments, earliestDate, latestDate);
			filteredInvestments = Investment.filterInvestmentsByRepaymentMethod(filteredInvestments, this.state.repaymentMethod);
			filteredInvestments = Investment.filterInvestmentsByIssuer(filteredInvestments, this.state.issuer);
			
			// Sort the investments by project ID, the project ID is the date and that's how we can compute the idle days
			if(filteredInvestments.length > 0) {
				filteredInvestments.sort((investmentA, investmentB) => {
					return investmentA.properties["projectId"] - investmentB.properties["projectId"];
				});

				// Calculate the total idle days
				var totalIdleDays = 0;

				for(var k = 1; k < filteredInvestments.length; k++) {
					var idleDays = filteredInvestments[k - 1].getOpenDate().daysBetween(filteredInvestments[k].getOpenDate());

					if(k === 1 || idleDays > this.idleDaysStats["high"])
						this.idleDaysStats["high"] = idleDays;						

					if(k === 1 || idleDays < this.idleDaysStats["low"])
						this.idleDaysStats["low"] = idleDays;

					totalIdleDays += idleDays;
				}

				// Calculate the average
				this.idleDaysStats["avg"] = totalIdleDays / filteredInvestments.length;
			}

			var totalGrossInterestRate = 0;	
			var totalGrossInterestRateAfterTenure = 0;
			var totalTenure = 0;

			for(var i = 0; i < filteredInvestments.length; i++) {
				var investment = filteredInvestments[i];
	
				if(investment.properties["status"] === "On Hold") {
					numOnHold++;
					onHoldAmount += investment.properties["investmentAmount"];
					continue;
				}

				// Update the distribution of interest rates
				if(!(investment.properties["grossInterestRate"] in this.interestRateDistribution)) {
					this.interestRateDistribution[investment.properties["grossInterestRate"]] = { 
						"frequency": 0
					};
				}

				this.interestRateDistribution[investment.properties["grossInterestRate"]].frequency++;

				// Update the distribution of tenure
				if(!(investment.properties["tenure"] in this.tenureDistribution)) {
					this.tenureDistribution[investment.properties["tenure"]] = 1;
				} else {
					this.tenureDistribution[investment.properties["tenure"]]++;
				}

				// Update the distribution of interest rate and tenure
				var interestRateByTenure = (investment.properties["grossInterestRate"] * 100).toFixed(2) + "% @ " + investment.properties["tenure"] + " month(s)";

				if(!(interestRateByTenure in this.interestRateTenureDistribution)) {
					this.interestRateTenureDistribution[interestRateByTenure] = 1;
				} else {
					this.interestRateTenureDistribution[interestRateByTenure]++;
				}

				// Update gross interest stats
				var grossInterestRate = investment.properties["grossInterestRate"];

				if(i === 0 || grossInterestRate > this.grossInterestRateStats["high"])
					this.grossInterestRateStats["high"] = grossInterestRate;
				
				if(i === 0 || grossInterestRate < this.grossInterestRateStats["low"])
					this.grossInterestRateStats["low"] = grossInterestRate;

				// Update tenure stats
				var tenure = investment.properties["tenure"];

				if(i === 0 || tenure > this.tenureStats["high"])
					this.tenureStats["high"] = tenure;

				if(i === 0 || tenure < this.tenureStats["low"])
					this.tenureStats["low"] = tenure;

				// Update gross interest rate after tenure stats
				var grossInterestRateAfterTenure = (investment.properties["grossInterestRate"] / 12) * investment.properties["tenure"];

				if(i === 0 || grossInterestRateAfterTenure > this.grossInterestRateAfterTenureStats["high"])
					this.grossInterestRateAfterTenureStats["high"] = grossInterestRateAfterTenure;
				
				if(i === 0 || grossInterestRateAfterTenure < this.grossInterestRateAfterTenureStats["low"])
					this.grossInterestRateAfterTenureStats["low"] = grossInterestRateAfterTenure;

				// Update subscription days stats
				var subscriptionDays = investment.calculateSubscriptionDays();

				if(i === 0 || subscriptionDays > this.subscriptionDaysStats["high"])
					this.subscriptionDaysStats["high"] = subscriptionDays;
				
				if(i === 0 || subscriptionDays < this.subscriptionDaysStats["low"])
					this.subscriptionDaysStats["low"] = subscriptionDays;

				totalGrossInterestRate += grossInterestRate;
				totalGrossInterestRateAfterTenure += grossInterestRateAfterTenure;
				totalTenure += tenure;
				totalSubscriptionDays += subscriptionDays;
	
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
	
					if(schedule["date"].compareTo(earliestDate) >= 0 && schedule["date"].compareTo(latestDate) <= 0) {
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
			}

			this.numOngoingProjects = filteredInvestments.length - numOnHold;
			this.gainPercent = (((this.projectedNetAmount - this.amountInvested) / this.amountInvested) * 100).toFixed(2);
			
			if(isNaN(this.gainPercent))
				this.gainPercent = 0;

			// Average interest rate calculation
			if(this.numOngoingProjects > 0) {
				this.grossInterestRateStats["avg"] = totalGrossInterestRate / this.numOngoingProjects;
				this.tenureStats["avg"] = totalTenure / this.numOngoingProjects;
				this.grossInterestRateAfterTenureStats["avg"] = totalGrossInterestRateAfterTenure / this.numOngoingProjects;
				this.subscriptionDaysStats["avg"] = totalSubscriptionDays / this.numOngoingProjects;
			}
		}

		// Set negative gain notification
		let negativeGainPercentNotification = <></>

		if(this.gainPercent < 0)
			negativeGainPercentNotification = <Alert className="clickable-alert" variant="info" onClick={(e) => { this.setState({"showNegativeGainExplanation": true}) }}>You got a <strong><u>negative gain</u></strong>.</Alert>

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

		// Set the pins
		let pins = <></>
		var pinId = 0;

		if(this.state.pins.length > 0) {
			pins = this.state.pins.map((pin) => {
				pinId++;

				return <Col md="4" key={"pin-" + pinId}>
					<DashboardPin pinNumber={pinId} pin={pin} removePinClick={this.handleRemovePinClick} />
				</Col>
			});
		}

		return (
			<>
				<Row>
					<Col md="12">
						<h2>Dashboard</h2>
					</Col>
				</Row>				
				<Row>
					<Col md="12">{ negativeGainPercentNotification }</Col>
					<Col md="12">{ maturedProjectsNotification }</Col>
					<Col md="12">{ onHoldProjectsNotification }</Col>
					<Col md="12">{ payoutsTodayNotification }</Col>
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
					<Col md="4">
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
					<Col md="4">
						<Form.Group>
							<Button onClick={ () => { this.setState({"showInterestRateDistribution": true}) } } variant="link" style={{ padding: 0, margin: 0 }} className="float-right"><small>Distribution</small></Button>
							<Form.Label>Gross Interest Rate per annum</Form.Label>
							<ProgressBar className="progress" now={ (this.grossInterestRateStats["avg"] * 100) } max="20" />
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Avg</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateStats["avg"] * 100).toFixed(2) + "%" } />
								<InputGroup.Prepend>
									<InputGroup.Text>High</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateStats["high"] * 100).toFixed(2) + "%" } />
								<InputGroup.Prepend>
									<InputGroup.Text>Low</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateStats["low"] * 100).toFixed(2) + "%" } />
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
							<Form.Label>Gross Interest Rate after Tenure</Form.Label>
							<ProgressBar className="progress" now={ this.grossInterestRateAfterTenureStats["avg"] * 100 } max="20" />
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Avg</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateAfterTenureStats["avg"] * 100).toFixed(2) + "%" } />
								<InputGroup.Prepend>
									<InputGroup.Text>High</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateAfterTenureStats["high"] * 100).toFixed(2) + "%" } />
								<InputGroup.Prepend>
									<InputGroup.Text>Low</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ (this.grossInterestRateAfterTenureStats["low"] * 100).toFixed(2) + "%" } />
							</InputGroup>
						</Form.Group>						
						<Form.Group>
							<Form.Label>Subscription Length (days)</Form.Label>
							<ProgressBar className="progress" now={ this.subscriptionDaysStats["avg"] } max="30" />
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Avg</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ parseInt(this.subscriptionDaysStats["avg"]) } />
								<InputGroup.Prepend>
									<InputGroup.Text>High</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ this.subscriptionDaysStats["high"] } />
								<InputGroup.Prepend>
									<InputGroup.Text>Low</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ this.subscriptionDaysStats["low"] } />
							</InputGroup>
						</Form.Group>						
					</Col>
					<Col md="4">
						<Form.Group>
							<Form.Label>Days before participating on another project</Form.Label>
							<ProgressBar className="progress" now={ this.idleDaysStats["avg"] } max="30" />
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Avg</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ parseInt(this.idleDaysStats["avg"]) } />
								<InputGroup.Prepend>
									<InputGroup.Text>High</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ this.idleDaysStats["high"] } />
								<InputGroup.Prepend>
									<InputGroup.Text>Low</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={ this.idleDaysStats["low"] } />
							</InputGroup>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col md="12" style={{ textAlign: "center", marginBottom: "1rem" }}>
						<ButtonGroup size="lg" className="mb-2">
							<Button onClick={ ()=> { this.handleCreatePinClick(); } }>Pin Report</Button>
							<Button variant="dark" onClick={ () => { this.setState({"showPinReportHelp": true}) } }>?</Button>
						</ButtonGroup>						
					</Col>
				</Row>
				<Row>		
					{ pins }
				</Row>
				<Modal show={this.state.showInterestRateDistribution} onHide={(e) => { this.setState({"showInterestRateDistribution": false}) }}>
					<Modal.Header closeButton>
						<Modal.Title>Interest Rate Distribution</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table responsive striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th className="align-middle">Gross % p.a.</th>
                                    <th className="align-middle">Frequency</th>
                                </tr>
                            </thead>
                            <tbody>
								{
									Object.keys(this.interestRateDistribution).sort().map((grossInterestRate) => {
										return <tr>
											<td>{ (grossInterestRate * 100).toFixed(2) }%</td>
											<td>{ (this.interestRateDistribution[grossInterestRate]["frequency"]) }</td>
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
									<th className="align-middle">Gross Interest Rate</th>
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
				<Modal show={this.state.showNegativeGainExplanation} onHide={(e) => { this.setState({"showNegativeGainExplanation": false}) }}>
					<Modal.Header closeButton>
						<Modal.Title>Negative Gain</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>
							You have a negative gain on the <strong>selected range of date</strong>{' '}
							because you have <strong>more funds on balloon repayment projects than equal repayment projects</strong>.{' '}
							Unlike equal repayment projects, your invested funds in a balloon repayment project is{' '}
							<strong>not divided into months but summed as a whole</strong>. Some of the interests might have{' '}
							been paid which already lowered your negative gain. As we move closer to the maturity dates more interest earned will be released and{' '}
                			the negative gain will soon decrease and become positive <strong>once the tenure of the balloon projects have been reached</strong>.{' '}
							So within the range of dates you have selected, some of your <strong>balloon projects{' '}
							have not yet reached their tenure</strong> which resulted to a negative gain.
						</p>
					</Modal.Body>
				</Modal>
				<Modal show={this.state.showPinReportHelp} onHide={(e) => { this.setState({"showPinReportHelp": false}) }}>
					<Modal.Header closeButton>
						<Modal.Title>Pin Report</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>
							This feature allows you to take a snapshot of the calculated values in the dashboard based on the selected filters.
							This is useful if you want to perform an analysis by comparing the performance of your investments from different dates,
							repayment methods, and/or issuers.
						</p>
						<p>
							<strong>Note that snapshots does not update. If changes were made on investments, the snapshot will
							not reflect those changes.</strong>
						</p>
					</Modal.Body>
				</Modal>				
			</>
		);
	}
}

export default DashboardContainer;
