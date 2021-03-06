import React from "react";
import { Alert, Row, Col, Button, Container } from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";

// For programmer credits
class AboutComponent extends React.Component {

    // Open my BMC page
    buyMeACoffee() {
        var link = document.createElement("a");
        link.href = "https://www.buymeacoffee.com/it2051229";
        link.target = "_blank";
        link.click();
    }

    // Display info
	render() {
		return (
            <>
                <NavigationBarComponent activeMenuName="About" />
                <Container fluid>
                    <Row>
                        <Col md="6">
                            <h4>Are you related to Flint?</h4>
                            <p>
                                No, just like you we are fellow investors in Flint.
                            </p>
                            <h4>Do you keep my data?</h4>
                            <p>
                                No, all your data are private and locally stored on this web browser. We do not keep your 
                                data in our servers. You cannot access your data from another computer or web browser.
                            </p>
                            <h4>Can I keep my data?</h4>
                            <p>
                                Yes, you can export your data. It will be extracted from your computer and downloaded as a file. 
                                You can then import the file through using this app from another web browser.
                            </p>
                        </Col>
                        <Col md="6">
                            <h4>What else do I need to know before using this app?</h4>
                            <p>
                                This project is a work in progress but you're using a stable version. 
                                There might be changes and improvements anytime so you should use it at your own risk. 
                                We recommend to backup your data frequently.
                            </p>
                            <p>
                                We're gradually adding features and fixing things so check our change logs from time to time so you can download
                                the latest stable version:
                            </p>                    
                            <Alert variant="dark">
                                <Alert.Link href="https://it2051229.github.io/flint/download.html" target="_blank" rel="noopener noreferrer">https://it2051229.github.io/ flint/download.html</Alert.Link>
                            </Alert>    
                            <p>
                                If you found any issues feel free to shoot 
                                us a message at <a href="mailto:contact@it2051229.com">contact@it2051229.com</a>.
                            </p>
                            <p>
                                <center><Button variant="primary" onClick={(e) => this.buyMeACoffee()}>Buy me a coffee!</Button></center>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </>
		);
	}
}

export default AboutComponent;
