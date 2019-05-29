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
import Faculties from "../../../contracts/Faculties";

class UpdateFaculty extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            faculty: {
                id: '',
                name: '',
                shortDesc: '',
                image: '',
                phone: '',
                email: '',
                info: '',
            },
            contracts: {},
        };

        let facultyId = props.match.params.id;
        this.getFaculty = this.getFaculty.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.renderForm = this.renderForm.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getFaculty(facultyId);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = Faculties.networks[networkId];
        const faculties = new window.web3Provider.eth.Contract(
            Faculties.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            facultiesContract: faculties,
        };
    }

    async getFaculty(_id) {
        const contract  = this.state.contracts.facultiesContract;
        let faculty = await contract.methods.getById(_id).call();
        faculty = JSON.parse(faculty);
        faculty.info = decodeURIComponent(faculty.info);
        this.setState({faculty: faculty});
    }

    renderForm(){
        if(this.state.faculty.id){
            return(
                <FacultyForm faculty={this.state.faculty}/>
            );
        }
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Update Faculty" subtitle="" className="text-sm-left" />
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
                                            {this.renderForm()}
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
export default UpdateFaculty;
