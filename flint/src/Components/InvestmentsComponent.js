import React from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Investment from "../Entities/Investment";
import NumberUtils from "../Entities/NumberUtils";
import Database from "../Entities/Database";

// This holds components for listing investments
class InvestmentsComponent extends React.Component {

	// Initialize the investments component
	constructor(props) {
		super(props);

		this.investments = new Database().getInvestments();

		this.state = {
			"sortedBy": "Project ID",
			"sortOrder": "Ascending",
			"repaymentMethod": "All"
		}

		if("flintInvestments.state" in localStorage)
            this.state = JSON.parse(window.localStorage.getItem("flintInvestments.state"));
	}

	// Display the investments
	render() {

		let investmentsTableRows = <tr>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
		</tr>;
		
		if(this.investments.length > 0) {
            // Filter by repayment method
            var filteredInvestments = Investment.filterInvestmentsByRepaymentMethod(this.investments, this.state.repaymentMethod);

            // Do sorting
            var sortedBy = this.state.sortedBy;
            
            filteredInvestments.sort((investmentA, investmentB) => {
				if(sortedBy === "Project Name")
					return investmentA.properties["projectId"].localeCompare(investmentB.properties["projectId"]);
                
                if(sortedBy === "Investment Amount")
                    return investmentA.properties["investmentAmount"] - investmentB.properties["investmentAmount"];
                
                if(sortedBy === "Interest Rate")
                    return investmentA.properties["netInterestRate"] - investmentB.properties["netInterestRate"];
            
                if(sortedBy === "Next Pay Date") {
                    var dateA = investmentA.calculateNextPayDate(); 
                    var dateB = investmentB.calculateNextPayDate();

                    if(investmentA.properties["status"] === "On Hold" && investmentB.properties["status"] === "On Hold")
                        return 0;
                    
                    if(investmentA.properties["status"] === "On Hold" && investmentB.properties["status"] === "Invested")
                        return 1;

                    if(investmentA.properties["status"] === "Invested" && investmentB.properties["status"] === "On Hold")
                        return -1;

                    if(dateA === null && dateB === null)
                        return 0;
                    
                    if(dateA === null)
                        return 1;
                    
                    if(dateB === null)
                        return -1;
                        
                    return dateA.compareTo(dateB);
                }

                if(sortedBy === "Maturity Date") {
                    if(investmentA.properties["status"] === "On Hold" && investmentB.properties["status"] === "On Hold")
                        return 0;
                    
                    if(investmentA.properties["status"] === "On Hold" && investmentB.properties["status"] === "Invested")
                        return 1;

                    if(investmentA.properties["status"] === "Invested" && investmentB.properties["status"] === "On Hold")
                        return -1;

                    return investmentA.calculateMaturityDate().compareTo(investmentB.calculateMaturityDate());
                }

                return 0;
            });

            // Reverse if descending
            if(this.state.sortOrder === "Descending")
                filteredInvestments.reverse();
            
            // Put it as an output
            investmentsTableRows = filteredInvestments.map((investment) => {
                var payDateDetails = investment.calculateNextPayAndMaturityDate();

                // When a row is clicked, we save the scroll so we can store later on
                return (
					<tr key={investment.properties["projectId"]} onClick={(e) => { window.location.href = "#/investment/" + investment.properties["projectId"]; }}>
						<td><strong>{ investment.properties["projectId"] }</strong></td>
						<td>{ NumberUtils.formatCurrency(investment.properties["investmentAmount"]) }</td>
						<td>
							{ (investment.properties["netInterestRate"] * 100).toFixed(2) }% p.a. {' '}
							{ investment.properties["repaymentMethod"] }
						</td>
						<td>{ NumberUtils.formatCurrency(investment.properties["investmentAmount"] + investment.calculateNetGainAmount()) }</td>
						<td>{ payDateDetails["nextPayDate"].toString() }</td>
						<td>{ NumberUtils.formatCurrency(payDateDetails["nextPayAmount"]) }</td>
						<td>{ payDateDetails["maturityDate"].toString() }</td>
					</tr>
				);
            });
		}
		
		// Save the filters
        window.localStorage.setItem("flintInvestments.state", JSON.stringify(this.state));

		return (
			<>
				<NavigationBarComponent activeMenuName="Investments" />
				<Container fluid>
					<Row>
						<Col md="12">
							<h2>Investments</h2>
							<p><Button variant="primary" href="#/investment">Add Investment</Button></p>
						</Col>
					</Row>
					<Row>
						<Col md="4">
							<Form.Group>
								<Form.Text className="text-muted">Sorted By</Form.Text>
								<Form.Control as="select" custom
									value={this.state.sortedBy} onChange={(e) => { this.setState({"sortedBy": e.target.value }) }}>
									<option>Project Name</option>
									<option>Investment Amount</option>
									<option>Interest Rate</option>
									<option>Next Pay Date</option>
									<option>Maturity Date</option>
								</Form.Control>
							</Form.Group>
						</Col>
						<Col md="4">
							<Form.Group>
								<Form.Text className="text-muted">Sort Order</Form.Text>
								<Form.Control as="select" custom
									value={this.state.sortOrder} onChange={(e) => { this.setState({"sortOrder": e.target.value }) }}>
									<option>Ascending</option>
									<option>Descending</option>
								</Form.Control>
							</Form.Group>
						</Col>
						<Col md="4">
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
						<Col md="12">
							<Table id="investmentsTable" responsive striped bordered hover variant="dark">
								<thead>
									<tr>
										<th className="align-middle">Project</th>
										<th className="align-middle">Investment Amount</th>
										<th className="align-middle">Net %</th>
										<th className="align-middle">Net Payout</th>
										<th className="align-middle">Next Pay Date</th>
										<th className="align-middle">Next Pay Amount</th>
										<th className="align-middle">Maturity Date</th>
									</tr>
								</thead>
								<tbody>{ investmentsTableRows }</tbody>
							</Table>
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

export default InvestmentsComponent;
