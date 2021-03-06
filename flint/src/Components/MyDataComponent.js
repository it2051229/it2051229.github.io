import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";
import Database from "../Entities/Database";
import MyDate from "../Entities/MyDate";

// Container for import and export of data
class MyDataComponent extends React.Component {

	// Initialize stuff
	constructor(props) {
		super(props);

		this.database = new Database();
	}

	// Export data and download it
	handleExportClick() {		
		var downloadLink = document.createElement("a");
		downloadLink.download = "flint " + MyDate.now().toString() + ".data";
		downloadLink.href="data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.database.exportAsJson()));
		downloadLink.click();
	}

	// Import from a json file
	handleImportClick(file) {
		if(!window.confirm("This will delete your current data, are you sure you want to continue?"))
			return;
		
		var fileReader = new FileReader();
		var database = this.database;

		fileReader.onload = () => {
			try {
				if(database.importJson(JSON.parse(fileReader.result)))
					window.alert("Import successful.");
				else
					window.alert("Import failed.");
			} catch(err) {
				console.log(err);
				window.alert("Invalid file.");
			}
		}
		
		fileReader.readAsText(file)
	}

	// Delete all stored data
	handleResetClick() {
		if(!window.confirm("Are you sure you want to clear your data?"))
			return;

		this.database.clear();
		window.alert("Clear successful.");		
	}

	render() {
		return (
			<>
				<NavigationBarComponent activeMenuName="My Data" />
				<Container fluid>
					<Row>
						<Col md="6">
							<h2>My Data</h2>
							<p>
								Your data is locally saved on this web browser you are currently using. 
								You can continue working on it anytime. 
								You can export and download your data as a file if you wish to work 
								on your data from another device or web browser.
							</p>
							<h2>Export</h2>
							<p><Button variant="primary" onClick={(e) => { this.handleExportClick() }}>Download My Data</Button></p>
							<h2>Import</h2>
							<p>Restore your data from an exported file. This replaces any data that is currently saved.</p>
							<Form.File label="Browse or drag file to this box" custom
								onChange={(e) => { this.handleImportClick(e.target.files[0]) }} />
							<br /><br />
						</Col>
						<Col md="6">
							<h2>Reset</h2>
							<p>Delete all your saved data from this web browser.</p>
							<p><Button variant="danger" onClick={(e) => { this.handleResetClick() }}>Clear My Data</Button></p>
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

export default MyDataComponent;
