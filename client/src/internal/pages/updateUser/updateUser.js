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
import Users from "../../../contracts/Users";
import UserForm from "../../components/userForm/userForm";

class UpdateUser extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            user: {
                name: '',
                email: '',
                photo: '',
                info: '',
            },
            contracts: {},
        };

        let userId = props.match.params.id;
        this.getUser = this.getUser.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.renderForm = this.renderForm.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getUser(userId);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = Users.networks[networkId];
        const users = new window.web3Provider.eth.Contract(
            Users.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            usersContract: users,
        };
    }

    async getUser(_id) {
        const contract  = this.state.contracts.usersContract;
        let user = await contract.methods.getById(_id).call();
        user = JSON.parse(user);
        user.id = user.id.substring(4);
        user.info = user.info ? JSON.parse(decodeURIComponent(user.info)) : {};
        user.publicKey = decodeURIComponent(user.publicKey);
        this.setState({user: user});
    }

    renderForm(){
        if(this.state.user.id){
            return(
                <UserForm user={this.state.user}/>
            );
        }
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Update User" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">User</h6>
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
export default UpdateUser;
