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
import UserForm from "../../components/userForm/userForm";
import StudentForm from "../../components/studentForm/studentForm";
import MarksForm from "../../components/marksForm/marksForm";

class AddMarks extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            mark: {
                id: '',
                faculty: '',
                group: '',
                year: '',
                half: 0,
                students: '',
                marks: '',
                article: '',
                lecturer: ''
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
                    <PageTitle sm="4" title="Add Mark" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Mark</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            <MarksForm mark={this.state.mark}/>
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
export default AddMarks;
