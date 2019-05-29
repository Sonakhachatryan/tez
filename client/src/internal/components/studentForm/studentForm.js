import React from "react";
import Users from "../../../contracts/Users.json";
import Students from "../../../contracts/Students.json";
import { Buffer } from 'buffer';
import {
    Button,
    Col,
    Row,
    Form,
    FormInput,
    FormTextarea,
    FormFeedback, FormSelect,
} from "shards-react";
import Keypair from "keypair";
import {Link} from "react-router-dom";

class StudentForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.user.id,
            name: this.props.user.name,
            email: this.props.user.email,
            photo: this.props.user.photo,
            publicKey: this.props.user.publicKey,
            degree: this.props.user.degree,
            course: this.props.user.course,
            group: this.props.user.group,
            entranceMarks: this.props.user.entranceMarks,
            info: this.props.user.info,
            privateKey: '',
            role: 3,
            faculty: window.loggedInUser.info.faculty,
            isSet: this.props.user.id,
            contracts: {},
            faculties: [],
            formErrors: {
                id: '',
                name:'',
                email: '',
                publicKey: '',
                role: '',
                degree: '',
                course: '',
                group: ''

            },
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);
        this.renderKey = this.renderKey.bind(this);
        this.generateKey = this.generateKey.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
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

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name,value);
    }

    handleUserInputInfo = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let info = this.state.info;
        info[name] = value;
        this.setState({info: info});
    }

    async save(){
        let res = false;
        if(this.state.privateKey){
             res = await fetch('http://localhost:3001/private-key/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    privateKey: this.state.privateKey,
                })
            })
        }else{
            res = true;
        }

        if(res){
            const photo = document.getElementById("image");
            let url = this.state.photo;
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
                    const photo = document.getElementById("image");
                    fileReader.readAsArrayBuffer(photo.files[0]);
                });
            }

            this.setState({photo: url});
        }
        const usersContract  = this.state.contracts.usersContract;
        const studentsContract  = this.state.contracts.studentsContract;
        if(this.state.isSet){
            usersContract.methods.update(
                this.state.id,
                this.state.name,
                this.state.email,
                this.state.photo,
                encodeURIComponent(JSON.stringify(this.state.info))
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

            studentsContract.methods.updateStudent(
                this.state.id,
                "1111" + this.state.id,
                this.state.degree,
                this.state.course,
                this.state.group
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        }else{
            usersContract.methods.createUser(
                this.state.id,
                "1111" + this.state.id,
                this.state.name,
                this.state.email,
                this.state.photo,
                encodeURIComponent(this.state.publicKey),
                encodeURIComponent(JSON.stringify(this.state.info)),
                this.state.role,
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

            studentsContract.methods.createStudent(
                this.state.id,
                "1111" + this.state.id,
                this.state.faculty,
                this.state.degree,
                this.state.course,
                this.state.group,
                ''
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }


        // window.location = '/admin/user/all';
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'id':
            case 'name':
            case 'publicKey':
            case 'degree':
            case 'course':
            case 'group':
                let fieldIsValid = value.length !== 0;
                fieldValidationErrors[fieldName] = fieldIsValid ? '': 'This field is required.';
                if(!fieldIsValid) {
                    errorsCount++ ;
                }
                break;
            default:
                break;
        }

        this.setState({formErrors: fieldValidationErrors,
            isFormValid: !!errorsCount
        });
    }

    renderKey(){
        if(!this.state.isSet){
            if(this.state.publicKey){
                return (
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="shortDesc">Public Key</label>
                            <FormTextarea
                                id='publicKey'
                                value={this.state.publicKey}
                                placeholder="Public Key"
                                onChange = {this.handleUserInputSection}
                            />
                            <FormFeedback>{this.state.formErrors.publicKey}</FormFeedback>
                        </Col>
                    </Row>
                );
            }else{
                return (
                    <Row form>
                        <Button className="mt-3 btn-success" type="button" onClick={this.generateKey}>Generate Key</Button>
                    </Row>
                )
            }
        }else{
                return '';
        }

    }

    generateKey(){
        var pair = new Keypair();
        this.setState({
            publicKey: pair.public,
            privateKey: pair.private,
        })

    }

    render(){
        return(
            <div>
                <img src={this.state.photo}  className={'img-thumbnail w-25 h-25 mb-2 ml-2 ' + (this.state.photo ? ' d-block' : ' d-none')} />
                <Form>
                    <Row form className={ this.state.isSet ? ' d-none' : ''}>
                        <Col md="12" className="form-group">
                            <label htmlFor="name">Ethereum Address</label>
                            <FormInput
                                id="id"
                                name="id"
                                type="text"
                                placeholder="Etherium Address"
                                value={this.state.id}
                                onChange={ this.handleUserInput }
                                invalid={ !!this.state.formErrors.id }
                            />
                            <FormFeedback>{this.state.formErrors.id}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="image">Image</label>
                            <FormInput
                                id="image"
                                name="photo"
                                type="file"
                                placeholder="Image"
                                onChange = {this.handleUserInput}
                                invalid={ !!this.state.formErrors.photo }
                            />
                            <FormFeedback>{this.state.formErrors.photo}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="name">Name</label>
                            <FormInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Name"
                                value={this.state.name}
                                onChange={ this.handleUserInput }
                                invalid={ !!this.state.formErrors.name }
                            />
                            <FormFeedback>{this.state.formErrors.name}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="name">Email</label>
                            <FormInput
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={ this.handleUserInput }
                                invalid={ !!this.state.formErrors.email }
                            />
                            <FormFeedback>{this.state.formErrors.email}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputDegree">Degree</label>
                            <FormSelect id="feInputDegree" name="degree" value={this.state.degree ? this.state.degree: 0}  onChange={ this.handleUserInput }>
                                <option  value={0}>Select Degree</option>
                                <option  value={1}>Bachelor</option>
                                <option  value={2}>Master</option>
                                <option  value={3}>Graduate student</option>
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputCourse">Course</label>
                            <FormSelect id="feInputCourse" name="course" value={this.state.course ? this.state.course : 0}  onChange={ this.handleUserInput }>
                                <option disabled={true} value={0}>Select Course</option>
                                <option  value={1}>1</option>
                                <option  value={2}>2</option>
                                <option  value={3}>3</option>
                                <option  value={4}>4</option>
                                <option  value={5}>5</option>
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="group">Group</label>
                            <FormInput
                                id="group"
                                name="group"
                                type="text"
                                placeholder="Group"
                                value={this.state.group}
                                onChange={ this.handleUserInput }
                                invalid={ !!this.state.formErrors.group }
                            />
                            <FormFeedback>{this.state.formErrors.group}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form className={this.state.entranceMarks ?  '' : 'd-none'}>
                        <Col md="12">
                            <a href={this.state.entranceMarks} target="_blank">View Entrance Marks File</a>
                        </Col>
                    </Row>
                    {this.renderKey()}
                    <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                </Form>
            </div>
        );
    }
}
export default StudentForm;
