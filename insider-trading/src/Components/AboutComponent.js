import React from "react";
import { Col, Container, Row, Alert, Button} from "react-bootstrap";
import NavigationBarComponent from "./NavigationBarComponent";

class AboutComponent extends React.Component {

    // Initialize the about page
    constructor(props) {
        super(props);
    }

    // Open my BMC page
    buyMeACoffee() {
        let link = document.createElement("a");
        link.href = "https://www.buymeacoffee.com/it2051229";
        link.target = "_blank";
        link.click();
    }

    // Display the dashboard
    render() {
        return (
            <>
                <NavigationBarComponent activeMenuName="About" />
                <Container>
                    <Row>
                        <Col md="6">
                            <h3>Insider Trading Strategy</h3>
                            <p>
                                Insiders are those who work inside the company such as the chairman, directors, 
                                treasurers, auditors, and whatnot. They hold first-hand knowledge of what is 
                                going on inside the company. When an insider buys their company's share, it 
                                only means that they believe that the company is going to do great and that 
                                whatever the company is doing now will yield a good financial report. Once the 
                                report is published publicly, many investors will put a higher price on the 
                                stock because the company's value has increased. Of course, investors who bought 
                                earlier at a lower price have now gained profit.
                            </p>
                            <h3>Do you keep my data?</h3>
                            <p>
                                No, all your data are private and locally stored on this web browser. We do not keep your data in our servers. 
                                You cannot access your data from another computer or web browser.
                            </p>
                            <h3>Can I keep my data?</h3>
                            <p>
                                Yes, you can export your data. It will be extracted from your computer and downloaded as a file. 
                                You can then import the file through using this app from another web browser.
                            </p>
                        </Col>
                        <Col md="6">
                            <h3>Creative Commons License.</h3>
                            <p>
                                <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
                                    <img alt="Creative Commons License" style={{borderWidth:0}} src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" />
                                </a>
                                <br />
                                <span xmlnsDct="http://purl.org/dc/terms/" property="dct:title">
                                    Insider Trading
                                </span> by {" "}
                                <a xmlnsCc="http://creativecommons.org/ns#" href="https://www.it2051229.com/insidertrading" property="cc:attributionName" 
                                rel="cc:attributionURL">it2051229</a> is licensed under a 
                                <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.<br />
                                Based on a work at <a xmlnsDct="http://purl.org/dc/terms/" href="https://github.com/it2051229/it2051229.github.io/tree/master/insider-trading" rel="dct:source">https://github.com/it2051229/it2051229.github.io/tree/master/insider-trading</a>.
                            </p>
                            <h3>Disclaimer</h3>
                            <p>
                                This project is a work in progress but you're using a stable version. There might be changes 
                                and improvements anytime so you should use it at your own risk. We recommend to backup your data frequently.
                            </p>
                            <p>
                                If you're a developer feel free to fork our source code but don't forget to give credits.
                            </p>
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
