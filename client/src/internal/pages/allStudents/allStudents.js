import React from "react";
import { Link } from "react-router-dom";
import {Container, Row, Col, Card, CardHeader, CardBody, Form, FormInput, FormFeedback} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Users from "../../../contracts/Users";
import Students from "../../../contracts/Students";
import { Modal, Button } from 'react-bootstrap';
import {Buffer} from "buffer";

class AllStudents extends React.Component{
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
        this.deleteStudent = this.deleteStudent.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.upload = this.upload.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getStudents();
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

        deployedNetwork = Students.networks[networkId];
        const students = new window.web3Provider.eth.Contract(
            Students.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            usersContract: users,
            studentsContract: students,
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

    async getStudents() {
        //get all students
        const contract  = this.state.contracts.studentsContract;
        let users = await contract.methods.getAll().call();
        users = JSON.parse(users);
        for (let i = 0; i < users.length; i++){
            users[i].id = users[i].id.substring(4);
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

    async deleteStudent(userId) {
        const usersContract = this.state.contracts.usersContract;
        usersContract.methods.deleteUser(userId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        const studentsContract = this.state.contracts.studentsContract;
        studentsContract.methods.deleteStudent(userId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        this.getStudents();
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

    async upload(){
        const photo = document.getElementById("fileInput");
        let url = '';
        if(photo.files.length){
            url = await new Promise((resolve) => {
                let fileReader = new FileReader();
                fileReader.onloadend = function() {
                    const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
                    const buf = Buffer.from(fileReader.result) // Convert data into buffer
                    ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
                        if(err) {
                            console.error(err)
                            return
                        }
                        return resolve(`https://ipfs.io/ipfs/${result[0].hash}`);
                    })
                }
                const photo = document.getElementById("fileInput");
                fileReader.readAsArrayBuffer(photo.files[0]);
            });
        }

        if(url){
            const studentsContract  = this.state.contracts.studentsContract;
            studentsContract.methods.updateEntranceMarks(
                this.state.userId,
                url
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }
    }
    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Students" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Add Student</h6>
                                <Link to={"/admin/student/add"}><button className="btn btn-success"><i className="fa fa-plus"></i></button></Link>

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
                                            Group
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
                                            <td>{user.group}</td>
                                            <td>
                                                <Link to={'/admin/student/edit/' + user.id } title="Edit"><i className="material-icons">edit</i></Link>
                                                <button className={'actions-button'} title="Add entrance marks" onClick={this.handleShow.bind(null, user.id)} data-id={user.id}><i className="material-icons">backup</i></button>
                                                <button className={'actions-button'} title="Delete" onClick={this.deleteStudent.bind(null, user.id)} ><i className="material-icons">delete</i></button>
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
export default AllStudents;
