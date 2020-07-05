import React from "react";
import { Button, Table, Row, Col, Form } from "react-bootstrap";
import Database from "../Entities/Database";
import Investment from "../Entities/Investment";
import MyDate from "../Entities/MyDate";
import NumberUtils from "../Entities/NumberUtils";

// Displays the list of investments and the filtering features
class InvestmentsTable extends React.Component {

	// Initialize the investments list
	constructor(props) {
        super(props);

        // Prepopulate the initial filtering and sorting
        this.investments = new Database().getInvestments();
        this.issuers = Investment.getIssuers(this.investments);
        var dates = Investment.getEarliestAndLatestInvestmentDates(this.investments);

        // Set the filtering attributes
        if("investmentsTable.state" in localStorage) {
            this.state = JSON.parse(window.localStorage.getItem("investmentsTable.state"));

            if(dates != null) {
                this.state.fromDate = dates["earliest"].toString();
                this.state.toDate = dates["latest"].toString();
            }
        } else {
            console.log(dates);

            this.state = {
                "fromDate": dates !== null ? dates["earliest"].toString() : "",
                "toDate": dates !== null ? dates["latest"].toString() : "",
                "sortedBy": "Project ID",
                "sortOrder": "Ascending",
                "repaymentMethod": "All",
                "issuer": "All"
            }
        };

        // Used for restoring scroll
        this.listRef = React.createRef();
    }

    // Used for restoring scroll
    getSnapshotBeforeUpdate(prevProps, prevState) {
        try {
            if(prevProps.list.length < this.props.list.length) {
                const list = this.listRef.current;
                return list.scrollHeight - list.scrollTop;
            }
        } catch(err) {}

        return null;
    }

    // Used for restoring scroll
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(snapshot !== null) {
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }

	// Through the investments list is the only way to trigger an add investment and update investment
	// however the handling of the changing of component is on the InvestmentsContainer
	render() {
        // Load the issuers into the drop down
        let issuerOptions = this.issuers.map((issuer) => {
            return <option key={issuer}>{ issuer }</option>
        });

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
            // Filter by date
            var earliestDate = MyDate.toMyDate(this.state.fromDate);
            var latestDate = MyDate.toMyDate(this.state.toDate);            
            var filteredInvestments = Investment.filterInvestmentsByDate(this.investments, earliestDate, latestDate);

            // Filter by repayment method
            filteredInvestments = Investment.filterInvestmentsByRepaymentMethod(filteredInvestments, this.state.repaymentMethod);

            // Filter by issuer
            filteredInvestments = Investment.filterInvestmentsByIssuer(filteredInvestments, this.state.issuer);

            // Do sorting
            var sortedBy = this.state.sortedBy;
            
            filteredInvestments.sort((investmentA, investmentB) => {
                if(sortedBy === "Project ID")
                return investmentA.properties["propertyId"] - investmentB.properties["propertyId"];
                
                if(sortedBy === "Investment Amount")
                    return investmentA.properties["investmentAmount"] - investmentB.properties["investmentAmount"];
                
                if(sortedBy === "Interest Rate")
                    return investmentA.properties["grossInterestRate"] - investmentB.properties["grossInterestRate"];
            
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

                return <tr key={investment.properties["projectId"]} onClick={(e) => { this.props.openInvestmentClick(investment) }}>
                    <td><strong>{ investment.properties["projectId"] }</strong></td>
                    <td>{ NumberUtils.formatCurrency(investment.properties["investmentAmount"]) }</td>
                    <td>
                        { (investment.properties["grossInterestRate"] * 100).toFixed(2) }% p.a. {' '}
                        { investment.properties["repaymentMethod"] }
                    </td>
                    <td>{ NumberUtils.formatCurrency(investment.properties["investmentAmount"] + investment.calculateNetGainAmount()) }</td>
                    <td>{ payDateDetails["nextPayDate"].toString() }</td>
                    <td>{ NumberUtils.formatCurrency(payDateDetails["nextPayAmount"]) }</td>
                    <td>{ payDateDetails["maturityDate"].toString() }</td>
                </tr>
            });
        }

        // Save the filters
        window.localStorage.setItem("investmentsTable.state", JSON.stringify(this.state));

		return (
			<div ref={this.listRef}>
				<Row>
					<Col md="12">
						<h2>Investments</h2>
						<p><Button variant="primary" onClick={ this.props.addInvestmentClick }>Add Investment</Button></p>
					</Col>
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
							<Form.Text className="text-muted">Sorted By</Form.Text>
							<Form.Control as="select" custom
                                value={this.state.sortedBy} onChange={(e) => { this.setState({"sortedBy": e.target.value }) }}>
								<option>Project ID</option>
								<option>Investment Amount</option>
								<option>Interest Rate</option>
								<option>Next Pay Date</option>
								<option>Maturity Date</option>
							</Form.Control>
						</Form.Group>
					</Col>
					<Col md="2">
						<Form.Group>
							<Form.Text className="text-muted">Sort Order</Form.Text>
							<Form.Control as="select" custom
                                value={this.state.sortOrder} onChange={(e) => { this.setState({"sortOrder": e.target.value }) }}>
								<option>Ascending</option>
								<option>Descending</option>
							</Form.Control>
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
                    <Col md="12">
                        <Table id="investmentsTable" responsive striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th className="align-middle">Project ID</th>
                                    <th className="align-middle">Investment Amount</th>
                                    <th className="align-middle">Gross %</th>
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
			</div>
		);
	}
}

export default InvestmentsTable;
