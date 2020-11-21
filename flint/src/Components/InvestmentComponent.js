import React from "react";
import { Container, Row, Col, Button, Form, Table, Alert } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Investment from "../Entities/Investment";
import MyDate from "../Entities/MyDate";
import NumberUtils from "../Entities/NumberUtils";
import Database from "../Entities/Database";

// Form for adding/updating/deleting/viewing an investment
class InvestmentComponent extends React.Component {

	// Initialize the form
	constructor(props) {
		super(props);
		
		this.database = new Database();

		this.state = {
			"projectId": "",
			"investedAmount": "",
			"netInterestRate": "",
			"status": "Invested",
			"tenure": "",
			"repaymentMethod": "Equal",
			"date": "",
			"investment": null
		};

		if("id" in props.match.params) {
			// Edit mode, load the data
			var investment = this.database.findInvestment(props.match.params.id);

			if(investment === null)
				return;
			
			this.state["projectId"] = investment.properties["projectId"];
			this.state["investedAmount"] = investment.properties["investmentAmount"].toFixed(2);
			this.state["netInterestRate"] = (investment.properties["netInterestRate"] * 100).toFixed(2);
			this.state["status"] = investment.properties["status"];
			this.state["tenure"] = investment.properties["tenure"];
			this.state["repaymentMethod"] = investment.properties["repaymentMethod"];
			this.state["date"] = investment.properties["date"].toString();
			this.state["investment"] = investment;
		}
	}

	// Validate and tranform input into an investment object
	createInvestmentObject() {
		// Validate the project ID
        var validationResult = Investment.validateProjectId(this.state.projectId);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
        }
        
        if(this.props.formMode === "add") {
            if(this.database.findInvestment(this.state.projectId) != null) {
                alert("Another project has this name already.");
                return null;
            }
        }
		
		// Validate the invested amount
        validationResult = Investment.validateInvestedAmount(this.state.investedAmount);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
		// Validate the net interest rate
        validationResult = Investment.validateNetInterestRate(this.state.netInterestRate);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
        // Validate the date only if it is not on hold
        var date = this.state.date;

        if(this.state.status === "Invested") {
            validationResult = Investment.validateDate(date);

            if(!validationResult["status"]) {
                alert(validationResult["message"]);
                return null;
            }
        } else if(this.state.status === "On Hold") {
            date = MyDate.now().toString()
            this.setState({ "date": date });
		}
		
		// Repayment method needs no validation...

		// Validate tenure
        validationResult = Investment.validateTenure(this.state.tenure);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
        // Calculate the net interest rate
        try {
            var investment = new Investment(
                this.state.projectId, 
                parseFloat(this.state.investedAmount), 
                parseFloat(this.state.netInterestRate) / 100.0,  
                MyDate.toMyDate(date), 
                this.state.repaymentMethod,
                parseInt(this.state.tenure),
                this.state.status);
            
            return investment;
        } catch(err) {
            alert("The project ID is invalid, make sure it follows SeedIn's format because it represents the opening date. If this project is invested, make sure the first pay date is after the opening date.");
            console.log(err);
        }

        return null;
	}

	// Calculate the net interest rates and the repayment schedules
	handleCalculateClick() {
		var investment = this.createInvestmentObject();

		if(investment == null)
			return;

		this.setState({"investment": investment});
    }

	// Validate and add a new investment
	handleAddClick() {
		var investment = this.createInvestmentObject();

		if(investment == null)
            return;
            
        // Do add
        this.database.addInvestment(investment);
        
        // After successful validation and add , we go back to the list of investments
        alert("Investment created.");
		window.location.href = "#/investments";
	}
	
	// Delete the investment
	handleDeleteClick() {
		if(!window.confirm("Are you sure you want to delete this investment?"))
			return;

		this.database.deleteInvestment(this.state.investment.properties["projectId"]);
		window.location.href = "#/investments";
	}

	// Update the investment
	handleUpdateClick() {
		var investment = this.createInvestmentObject();

        if(investment == null)
            return;

        // Do update
        this.database.addInvestment(investment);
        alert("Investment updated.");
	}

	// Display the form
	render() {
		let controls;
		let formTitle;
		let projectIdInputControl;

		if("id" in this.props.match.params) {
			// Update mode
			controls =
				<>
					<Button variant="dark" href="#/investments">Back</Button>{" "}
					<Button variant="danger" onClick={(e) => { this.handleDeleteClick() }}>Delete</Button>{" "}
					<Button variant="info" onClick={(e) => { this.handleCalculateClick() }}>Calculate</Button>{" "}
					<Button variant="primary" onClick={(e) => { this.handleUpdateClick() }}>Update</Button>
				</>
			
			formTitle = "Update Investment";

			projectIdInputControl = 
				<Form.Group>
					<Form.Label>Project Name</Form.Label>
					<Form.Control type="text" readOnly value={this.state.projectId} />
				</Form.Group>
		} else {
			// New mode investment mode
			controls = 
				<>
					<Button variant="dark" href="#/investments">Back</Button>{" "}
					<Button variant="info" onClick={(e) => { this.handleCalculateClick() }}>Calculate</Button>{" "}
					<Button variant="primary" onClick={(e) => { this.handleAddClick() }}>Add</Button>
				</>

			formTitle = "Add Investment";

			projectIdInputControl = 
				<Form.Group>
					<Form.Label>Project Name</Form.Label>
					<Form.Control type="text" placeholder="Project Name given by Flint" 
						value={this.state.projectId} onChange={(e) => { this.setState({"projectId": e.target.value}) }} />
				</Form.Group>
		}

		// First date of repayment appears only when the status of investment is "invested"
		let firstDateOfPaymentInputControl = <></>

		if(this.state.status === "Invested") {
			firstDateOfPaymentInputControl = 
				<Form.Group>
					<Form.Label>First Date of Payment Schedule</Form.Label>
					<Form.Control type="date" placeholder="yyyy-mm-dd"
						value={this.state.date} onChange={(e) => { this.setState({"date": e.target.value}) }} />
					<Form.Text className="text-muted">Please check your Flint account for the date.</Form.Text>
				</Form.Group>
		}
		
		// Set the investment details and table
        let netGainRate = "...";
        let netGainAmount = "...";
        let netTotalPayoutAmount = "...";
        let paymentSchedules = <tr><td>...</td><td>...</td><td>...</td></tr>
        let onHoldNotice = <></>

		// If an investment is provided then display the details
        if(this.state.investment !== null) {            
            netGainRate = (this.state.investment.calculateTenureInterestRate() * 100).toFixed(2) + "%";
            netGainAmount = this.state.investment.calculateNetGainAmount();
            netTotalPayoutAmount = this.state.investment.properties["investmentAmount"] + netGainAmount;
            paymentSchedules = this.state.investment.generateRepaymentSchedule();

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
            if(this.state.investment.properties["status"] === "On Hold") {
                onHoldNotice = <Alert variant="warning">This project is <strong>On Hold</strong> and the <strong>repayment dates are just samples dates</strong>. </Alert>
            }
        }

		return (
			<>
				<NavigationBarComponent activeMenuName="Investments" />
				<Container fluid>
					<Row>
						<Col md="6">
							<h2>{formTitle}</h2>
							<Form>
								{projectIdInputControl}
								<Form.Group>
									<Form.Label>Invested Amount</Form.Label>
									<Form.Control type="number" step="any" placeholder="₱"
										value={this.state.investedAmount} onChange={(e) => { this.setState({"investedAmount": e.target.value}) }} />
								</Form.Group>
								<Form.Group>
									<Form.Label>Net Interest Rate per annum</Form.Label>
									<Form.Control type="number" step="any" placeholder="%"
										value={this.state.netInterestRate} onChange={(e) => { this.setState({"netInterestRate": e.target.value}) }} />
								</Form.Group>
								<Form.Group>
									<Form.Label>Status</Form.Label>
									<Form.Control as="select" custom
										value={this.state.status} onChange={(e) => { this.setState({"status": e.target.value}) }}>
										<option>Invested</option>
										<option>On Hold</option>
									</Form.Control>
								</Form.Group>
								{ firstDateOfPaymentInputControl }
								<Form.Group>
									<Form.Label>Repayment Method</Form.Label>
									<Form.Control as="select" custom
										value={this.state.repaymentMethod} onChange={(e) => { this.setState({"repaymentMethod": e.target.value}) }}>
										<option>Equal</option>
										<option>Balloon</option>
									</Form.Control>
								</Form.Group>
								<Form.Group>
									<Form.Label>Tenure</Form.Label>
									<Form.Control type="number" placeholder="Months" 
										value={this.state.tenure} onChange={(e) => { this.setState({"tenure": e.target.value}) }}/>
								</Form.Group>
							</Form>
							<p style={{textAlign: "right"}}>
								{controls}
							</p>							
						</Col>
						<Col md="6">
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
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

export default InvestmentComponent;
