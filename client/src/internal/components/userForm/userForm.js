import React from "react";
import Users from "../../../contracts/Users.json";
import Faculties from "../../../contracts/Faculties.json";
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

class UserForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.user.id,
            name: this.props.user.name,
            email: this.props.user.email,
            photo: this.props.user.photo,
            publicKey: this.props.user.publicKey,
            info: this.props.user.info,
            privateKey: '',
            role: this.props.user.role | 0,
            isSet: this.props.user.id,
            contracts: {},
            faculties: [],
            formErrors: {
                id: '',
                name:'',
                email: '',
                publicKey: '',
                role: ''
            },
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);
        this.getFaculties = this.getFaculties.bind(this);
        this.renderKey = this.renderKey.bind(this);
        this.generateKey = this.generateKey.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getFaculties();
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

        deployedNetwork = Faculties.networks[networkId];
        const faculties = new window.web3Provider.eth.Contract(
            Faculties.abi,
            deployedNetwork && deployedNetwork.address,
        );
        return {
            usersContract: users,
            facultiesContract: faculties,
        };
    }



    async getFaculties() {
        const contract  = this.state.contracts.facultiesContract;
        let faculties = await contract.methods.getAll().call();
        faculties = JSON.parse(faculties);
        faculties.info = decodeURIComponent(faculties.info);
        this.setState({faculties: faculties});
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


        const contract  = this.state.contracts.usersContract;
        if(this.state.isSet){
            await contract.methods.update(
                this.state.id,
                this.state.name,
                this.state.email,
                this.state.photo,
                encodeURIComponent(JSON.stringify(this.state.info))
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }else{
            await contract.methods.createUser(
                this.state.id,
                "1111" + this.state.id,
                this.state.name,
                this.state.email,
                this.state.photo,
                encodeURIComponent(this.state.publicKey),
                encodeURIComponent(JSON.stringify(this.state.info)),
                this.state.role,
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }
        window.location = '/admin/user/all';
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'id':
            case 'name':
            case 'publicKey':
            case 'role':
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
                    <Row form className={this.state.isSet ? ' d-none' : ''}>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputState">Role</label>
                            <FormSelect id="feInputState" name="role" value={this.state.role}  onChange={ this.handleUserInput }>
                                <option disabled={true} value={0}>Select Role</option>
                                <option value={1}>Faculty Admin</option>
                                <option value={2}>Administrative Employee</option>
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form className={this.state.role != 1 ? ' d-none' : ''}>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputfaculty">Faculty</label>
                            <FormSelect id="feInputfaculty" name="faculty" value={this.state.info.faculty ? this.state.info.faculty: 0}  onChange={ this.handleUserInputInfo }>
                                <option disabled={true} value={0}>Select Faculty</option>
                                {this.state.faculties.map((faculty, i) => {
                                    return (<option value={faculty.id} key={i}>{faculty.name}</option>)
                                })}

                            </FormSelect>
                        </Col>
                    </Row>
                    {this.renderKey()}
                    <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                </Form>
            </div>
        );
    }
}
export default UserForm;
