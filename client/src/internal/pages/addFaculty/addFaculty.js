import React from "react";
import PageTitle from "../../components/common/PageTitle";
import {
    Card,
    Col,
    Row,
    Button,
    Container,
    CardHeader,
    FormInput,
    ListGroup,
    ListGroupItem
} from "shards-react";
import FacultyForm from "../../components/facultyForm/facultyForm";

class AddFaculty extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            faculty: {
                name: '',
                shortDesc: '',
                image: '',
                phone: '',
                email: '',
                info: '',
            },
            contracts: {},
        };

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }


    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Add Faculty" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Faculty</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            <FacultyForm faculty={this.state.faculty}/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default AddFaculty;
