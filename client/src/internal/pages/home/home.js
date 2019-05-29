import React from "react";
import PageTitle from "../../components/common/PageTitle";
import {
    Button,
    Card,
    Col,
    Row,
    Container,
    CardHeader,
    Form,
    FormInput,
    ListGroup,
    ListGroupItem
} from "shards-react";


class Home extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid className="main-content-container px-4">
                <Row>
                    <Col>
                        <div className="flex_container">
                            <div className="shadow_wrapper">
                                <div className="d-table">
                                    <img id="main-logo" className="d-inline-block align-top mr-1" src="assets/external/images/logo.png" alt="Dashboard"/>
                                </div>
                                <div className="welcome_page">
                                    <h2>Welcome To Edulearn</h2>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
    )
    }
    }
    export default Home;