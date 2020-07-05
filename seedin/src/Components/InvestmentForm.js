import React from "react";
import { Button,  Row, Col, Form, InputGroup, FormControl, Modal, ListGroup } from "react-bootstrap";
import InvestmentDetails from "./InvestmentDetails"
import Investment from "../Entities/Investment"
import MyDate from "../Entities/MyDate"
import Database from "../Entities/Database"

// Form for adding, calculating, deleting or updating an investment
class InvestmentForm extends React.Component {

	// Initialize the investment form
	constructor(props) {
		super(props);

        this.database = new Database();
        this.issuers = Investment.getIssuers(this.database.getInvestments());

        // Initialize the attributes to be accepted by this form
        if(props.formMode === "add") {
            this.state = {
                "projectId": "",
                "loanee": "",
                "projectUrl": "",
                "investedAmount": "",
                "grossInterestRate": "",
                "status": "Invested",
                "tenure": "",
                "repaymentMethod": "Equal",
                "date": "",
                "investment": null,
                "chooseIssuer": false
            };
        } else {
            // In update mode we pre-populate the fields
            this.state = {
                "projectId": props.investment.properties["projectId"],
                "loanee": props.investment.properties["issuer"],
                "projectUrl": props.investment.properties["projectUrl"],
                "investedAmount": props.investment.properties["investmentAmount"].toFixed(2),
                "grossInterestRate": (props.investment.properties["grossInterestRate"] * 100).toFixed(2),
                "status": props.investment.properties["status"],
                "tenure": props.investment.properties["tenure"],
                "repaymentMethod": props.investment.properties["repaymentMethod"],
                "date": props.investment.properties["date"].toString(),
                "investment": props.investment,
                "chooseIssuer": false
            }
        }
    }
    
    // Called after the form has been loaded, if the state is in, "update" mode
    // we will calculate the investment details
    componentDidMount() {
        window.scrollTo(0, 0);

        if(this.props.formMode === "update")
            this.handleCalculateClick();
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
                alert("Another project has this ID already.");
                return null;
            }
        }
		
		// Validate the invested amount
        validationResult = Investment.validateInvestedAmount(this.state.investedAmount);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
		// Validate the gross interest rate
        validationResult = Investment.validateGrossInterestRate(this.state.grossInterestRate);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
		// Validate the date only if it is not on hold
        if(this.state.status === "Invested") {
            validationResult = Investment.validateDate(this.state.date);

            if(!validationResult["status"]) {
                alert(validationResult["message"]);
                return null;
            }
        } else if(this.state.status === "On Hold") {
            this.setState({ "date": MyDate.now().toString() });
		}
		
		// Repayment method needs no validation...

		// Validate tenure
        validationResult = Investment.validateTenure(this.state.tenure);

        if(!validationResult["status"]) {
            alert(validationResult["message"]);
            return null;
		}
		
		// Calculate the net interest rate
        var investment = new Investment(
			this.state.projectId, 
            parseFloat(this.state.investedAmount), 
            parseFloat(this.state.grossInterestRate) / 100.0,  
            MyDate.toMyDate(this.state.date), 
            this.state.repaymentMethod,
            parseInt(this.state.tenure),
            this.state.status);

        investment.properties["projectUrl"] = this.state.projectUrl;
		investment.properties["issuer"] = this.state.loanee.toUpperCase();
		
        return investment;
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

		this.props.backClick();
    }
    
    // Validate and update an existing invetment
    handleUpdateClick() {
        var investment = this.createInvestmentObject();

        if(investment == null)
            return;

        // Do update
        this.database.addInvestment(investment);
        alert("Investment updated.");
    }

    // Delete an existing investment
    handleDeleteClick() {
        if(!window.confirm("Are you sure you want to delete this investment?"))
            return;
        
        this.database.deleteInvestment(this.state.investment.properties["projectId"]);
        this.props.backClick();
    }

	// Calculate the net interest rates and the repayment schedules
	handleCalculateClick() {
		var investment = this.createInvestmentObject();

		if(investment == null)
			return;

		this.setState({"investment": investment});
    }
    
	// Render the investment form depending on the mode assigned
	render() {
		let controls;
		let formTitle;
		let projectIdInputControl;

		if(this.props.formMode === "add") {
			// Controls when adding a new investment
			controls = 
				<>
					<Button variant="dark" onClick={ this.props.backClick }>Back</Button>{" "}
					<Button variant="info" onClick={(e) => { this.handleCalculateClick() }}>Calculate</Button>{" "}
					<Button variant="primary" onClick={(e) => { this.handleAddClick() }}>Add</Button>
				</>
			
			formTitle = "Add Investment";

			projectIdInputControl = 
				<Form.Group>
					<Form.Label>Project ID</Form.Label>
					<Form.Control type="text" placeholder="Unique ID given by SeedIn" 
						value={this.state.projectId} onChange={(e) => { this.setState({"projectId": e.target.value}) }} />
				</Form.Group>
		} else if(this.props.formMode === "update") {
			// Constrols when updating a form the project ID is unique
			controls =
				<>
					<Button variant="dark" onClick={ this.props.backClick }>Back</Button>{" "}
					<Button variant="danger" onClick={(e) => { this.handleDeleteClick() }}>Delete</Button>{" "}
					<Button variant="info" onClick={(e) => { this.handleCalculateClick() }}>Calculate</Button>{" "}
					<Button variant="primary" onClick={(e) => { this.handleUpdateClick() }}>Update</Button>
				</>
			
			formTitle = "Update Investment";

			projectIdInputControl = 
				<Form.Group>
					<Form.Label>Project ID</Form.Label>
					<Form.Control type="text" placeholder="Unique ID given by SeedIn" readOnly
						value={this.state.projectId} />
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
					<Form.Text className="text-muted">Please check your SeedIn account for the date.</Form.Text>
				</Form.Group>
        }

        // Initialize all issuers to the modal
        let issuersListGroupItems = this.issuers.map((issuer) => {
            return <ListGroup.Item key={issuer} action onClick={(e) => this.setState({ "loanee": issuer, "chooseIssuer": false })}>{issuer}</ListGroup.Item>
        });

		return (
            <Row>
                <Col md="6">
                    <h2>{formTitle}</h2>
                    <Form>
                        {projectIdInputControl}
                        <Form.Group>
                            <Form.Label>Borrower Name</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl placeholder="Issuer" 
                                    value={this.state.loanee} onChange={(e) => { this.setState({"loanee": e.target.value}) }} />
                                <InputGroup.Append>
                                    <Button variant="outline-dark" onClick={(e) => { this.setState({"chooseIssuer": true }) }}>Choose</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Modal show={this.state.chooseIssuer} onHide={(e) => { this.setState({"chooseIssuer": false }) }}>
                            <Modal.Header closeButton>
                                <Modal.Title>Choose Issuer</Modal.Title>                                
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup>
                                    { issuersListGroupItems }
                                </ListGroup>
                            </Modal.Body>
                        </Modal>
                        <Form.Group>
                            <Form.Label>Project URL (optional)</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control type="text" placeholder="Go to SeedIn, open the project, copy URL and paste it here." 
                                    value={this.state.projectUrl} onChange={(e) => { this.setState({"projectUrl": e.target.value}) }} />
                                <InputGroup.Append>
                                    <a href={this.state.projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">View</a>
                                </InputGroup.Append>                                
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Invested Amount</Form.Label>
                            <Form.Control type="number" step="any" placeholder="₱"
                                value={this.state.investedAmount} onChange={(e) => { this.setState({"investedAmount": e.target.value}) }} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Gross Interest Rate per annum</Form.Label>
                            <Form.Control type="number" step="any" placeholder="1% to 20%"
                                value={this.state.grossInterestRate} onChange={(e) => { this.setState({"grossInterestRate": e.target.value}) }} />
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
                            <Form.Control type="number" placeholder="1 to 12 months" 
                                value={this.state.tenure} onChange={(e) => { this.setState({"tenure": e.target.value}) }}/>
                        </Form.Group>
                    </Form>
                    <p style={{textAlign: "right"}}>
                        {controls}
                    </p>
                </Col>
                <Col md="6">
                    <InvestmentDetails investment={this.state.investment} />
                </Col>
            </Row>
		);
	}
}

export default InvestmentForm;
