import React from "react";
import InvestmentForm from "./InvestmentForm";
import InvestmentsTable from "./InvestmentsTable";

// This holds components for listing investments, adding, viewing, and updating
class InvestmentsContainer extends React.Component {

	// Initialize the investments container
	constructor(props) {
		super(props);

		// Initialize component to show is the investment lists
		this.state = { 
			activeComponentName: "InvestmentsTable",
			investment: null
		};

		// This function needs binding to this container because when an investment is selected
		// we need to make it executable to sub components
		this.handleOpenInvestmentClick = this.handleOpenInvestmentClick.bind(this);
	}

	// Make the active component the add investments
	handleAddInvestmentClick() {
		this.setState({ activeComponentName: "AddInvestmentForm", investment: null });
	}

	// Make the active component the update/view invsetment
	handleOpenInvestmentClick(clickedInvestment) {
		this.setState({ activeComponentName: "OpenInvestmentForm", investment: clickedInvestment });
	}

	// Back to the investments list component
	handleBackClick() {
		this.setState({ activeComponentName: "InvestmentsTable" });
	}

	// Render the appropraite container
	render() {
		// Component names and mapping component
		const componentNames = ["InvestmentsTable", "AddInvestmentForm", "OpenInvestmentForm"];
		const components = [ 
			<InvestmentsTable addInvestmentClick={(e) => { this.handleAddInvestmentClick() }} openInvestmentClick={ this.handleOpenInvestmentClick } />, 
			<InvestmentForm formMode="add" backClick={(e) => { this.handleBackClick() }} />,
			<InvestmentForm formMode="update" backClick={(e) => { this.handleBackClick() }} investment={this.state.investment} />];

		// Show the chosen component
		let activeComponent = components[componentNames.indexOf(this.state.activeComponentName)];	

		return (
			<>
				{activeComponent}
			</>
		);
	}
}

export default InvestmentsContainer;
