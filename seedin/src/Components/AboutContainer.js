import React from "react";
import { Row, Col, Button } from "react-bootstrap";

// For programmer credits
class AboutContainer extends React.Component {

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
                <Row>
                    <Col md="6">
                        <h4>Are you related to SeedIn?</h4>
                        <p>
                            No, just like you we are fellow investors in SeedIn. We are not in any 
                            way working for SeedIn nor associated with SeedIn.
                        </p>
                        <h4>Why build this application?</h4>
                        <p>
                            For some, SeedIn's dashboard makes it difficult to keep track and sort investments. 
                            Some opted to create their own excel sheets, some used calendar apps, some used 
                            their own custom database, and some used reminder apps to keep track of their 
                            investments. Each and everyone of us have questions with regards to our investments 
                            which SeedIn's dashboard cannot directly answer. We decided to create our 
                            personalized way of tracking investment to make things easier and clearer 
                            for us. After all, we all need to do due diligence and be in sync with what's 
                            going on with our funds.
                        </p>
                        <p>
                            We made it public and share with other SeedIn investors just in case it would be 
                            something useful to them.
                        </p>
                    </Col>
                    <Col md="6">
                        <h4>Do you keep my data?</h4>
                        <p>
                            No, all your data are private and locally stored on this web browser. We do not keep your 
                            data in our servers. You cannot access your data from another computer or web browser.
                        </p>
                        <h4>Can I keep my data?</h4>
                        <p>
                            Yes, you can export your data. It will be extracted from your computer and downloaded as a file. 
                            You can then import the file through using this app from a we browser.
                        </p>
                        <h4>What else do I need to know before using this app?</h4>
                        <p>
                            This project is a work in progress. There might be changes and improvements anytime 
                            so you should use it at your own risk. We recommend to backup your data frequently.
                        </p>
                        <p>
                            If you're looking for some feature that this app does not provide, feel free to shoot 
                            us a message at <a href="mailto:contact@it2051229.com">contact@it2051229.com</a>.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <center><Button variant="primary" size="lg" onClick={(e) => this.buyMeACoffee()}>Support this project! Buy me a coffee!</Button></center>
                    </Col>
                </Row>
            </>
		);
	}
}

export default AboutContainer;
