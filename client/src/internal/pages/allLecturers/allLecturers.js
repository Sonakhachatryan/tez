import React from "react";
import { Link } from "react-router-dom";
import {Container, Row, Col, Card, CardHeader, CardBody, Form, FormInput, FormFeedback} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Users from "../../../contracts/Users";
import Lecturers from "../../../contracts/Lecturers";
import { Modal, Button } from 'react-bootstrap';
import {Buffer} from "buffer";

class AllLecturers extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            show: false,
            file: '',
            userId: ''
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.deleteLecturer = this.deleteLecturer.bind(this);
        this.getLecturers = this.getLecturers.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getLecturers();
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

        deployedNetwork = Lecturers.networks[networkId];
        const lecturers = new window.web3Provider.eth.Contract(
            Lecturers.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            usersContract: users,
            lecturersContract: lecturers,
        };
    }

    async getUsers() {
        const contract  = this.state.contracts.usersContract;
        let users = await contract.methods.getAll(0, 0).call();
        // let users = await contract.methods.getKeys().call();
        users = JSON.parse(users);
        users.map((item, index) =>  {
            users[index].id = item.id.substring(4);
            users[index].publicKey = decodeURIComponent(item.publicKey);
        });

        switch (window.loggedInUser.role) {
            case "100":
                users = users.filter(user => ["1", "2"].indexOf(user.role) != -1);
                break;
            case "1":
        }

        this.setState({users: users});
    }

    async getLecturers() {
        //get all students
        const contract  = this.state.contracts.lecturersContract;
        let users = await contract.methods.getAll().call();
        users = JSON.parse(users);

        for (let i = 0; i < users.length; i++){
            users[i].id = users[i].id.substring(4);
            users[i].title = users[i].title ? JSON.parse(decodeURIComponent(users[i].title)) : {};
            users[i].bio = decodeURIComponent(users[i].bio);
        }
        users = users.filter(user => [window.loggedInUser.info.faculty].indexOf(user.faculty) != -1);

        let userIds = [];
        users.map((user) => {
            userIds.push(user.id);
        });

        const usersContract  = this.state.contracts.usersContract;
        users = await usersContract.methods.getByKeys(userIds).call();
        users = JSON.parse(users);
        users.map((item, index) =>  {
            users[index].id = item.id.substring(4);
            users[index].publicKey = decodeURIComponent(item.publicKey);
        });


        this.setState({users: users});
    }

    async deleteLecturer(userId) {
        const usersContract = this.state.contracts.usersContract;
        usersContract.methods.deleteUser(userId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        const lecturersContract = this.state.contracts.lecturersContract;
        lecturersContract.methods.deleteLecturer(userId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        this.getLecturers();
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow(id) {
        this.setState({ show: true, userId: id, file: '' });
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Lecturers" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Add Lecturer</h6>
                                <Link to={"/admin/lecturer/add"}><button className="btn btn-success"><i className="fa fa-plus"></i></button></Link>

                            </CardHeader>
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            #
                                        </th>
                                        <th scope="col" className="border-0">
                                            Name
                                        </th>
                                        <th scope="col" className="border-0">
                                            Email
                                        </th>
                                        <th scope="col" className="border-0">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.users.map((user, i) => {
                                        return (<tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Link to={'/admin/academic-works/all/' + user.id } title="documents"><i className="material-icons">vertical_split</i></Link>
                                                <Link to={'/admin/lecturer/edit/' + user.id } title="Edit"><i className="material-icons">edit</i></Link>
                                                <button className={'actions-button'} title="Delete" onClick={this.deleteLecturer.bind(null, user.id)} ><i className="material-icons">delete</i></button>
                                            </td>
                                        </tr>)
                                    })}

                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload File With Entrance Marks</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row form>
                                <Col md="12" className="form-group">
                                    <label htmlFor="image">Image</label>
                                    <FormInput
                                        id="fileInput"
                                        name="file"
                                        type="file"
                                        placeholder="File"
                                        onChange = {this.handleUserInput}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.upload}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}
export default AllLecturers;
