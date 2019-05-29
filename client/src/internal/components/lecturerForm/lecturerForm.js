import React from "react";
import Users from "../../../contracts/Users.json";
import Lecturers from "../../../contracts/Lecturers.json";
import ChairsABI from "../../../contracts/Chairs.json";
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
import ReactQuill from "react-quill";

class LecturerForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.user.id,
            name: this.props.user.name,
            email: this.props.user.email,
            photo: this.props.user.photo,
            publicKey: this.props.user.publicKey,
            faculty: window.loggedInUser.info.faculty,
            chair: this.props.user.chair,
            title: this.props.user.title,
            bio: this.props.user.bio,
            info: this.props.user.bio,
            privateKey: '',
            role: 4,
            isSet: this.props.user.id,
            contracts: {},
            chairs: [],
            formErrors: {
                id: '',
                name:'',
                email: '',
                publicKey: '',
                role: '',
                chair: '',
                title: '',
                bio: '',
                info: ''

            },
            isFormValid: false
        };

        this.getChairs = this.getChairs.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);
        this.renderKey = this.renderKey.bind(this);
        this.generateKey = this.generateKey.bind(this);
        this.handleUserInputMulty = this.handleUserInputMulty.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getChairs(window.loggedInUser.info.faculty);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });
    }

    handleUserInputMulty(event){
        let titles = this.state.title;
        if(titles.indexOf(event.target.value) === -1){
            titles.push(event.target.value);
        }else{
            titles.splice(titles.indexOf(event.target.value), 1)
        }

        this.setState({title: titles})
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

        deployedNetwork = ChairsABI.networks[networkId];
        const chairs = new window.web3Provider.eth.Contract(
            ChairsABI.abi,
            deployedNetwork && deployedNetwork.address,
        );
        return {
            usersContract: users,
            lecturersContract: lecturers,
            chairsContract: chairs,
        };
    }

    async getChairs(facultyId){
        const contract  = this.state.contracts.chairsContract;
        let chairs = await contract.methods.getFacultyChairs(facultyId).call();
        if(chairs){
            chairs = JSON.parse(JSON.parse(chairs));
            this.setState({chairs: chairs});
        }
    }

    handleQuillChange(value){
        this.setState({bio: value});
        this.validateField("bio", value);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name,value);
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

        let url = this.state.photo;
        if(res){
            const photo = document.getElementById("image");
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
        const lecturersContract  = this.state.contracts.lecturersContract;
        if(this.state.isSet){
            usersContract.methods.update(
                this.state.id,
                this.state.name,
                this.state.email,
                url,
                encodeURIComponent(JSON.stringify(this.state.info))
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

            lecturersContract.methods.updateLecturer(
                this.state.id,
                "1111" + this.state.id,
                this.state.faculty,
                this.state.chair,
                encodeURIComponent(JSON.stringify(this.state.title)),
                encodeURIComponent(this.state.bio),
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        }else{
            usersContract.methods.createUser(
                this.state.id,
                "1111" + this.state.id,
                this.state.name,
                this.state.email,
                url,
                encodeURIComponent(this.state.publicKey),
                encodeURIComponent(JSON.stringify(this.state.info)),
                this.state.role,
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

            lecturersContract.methods.createLecturer(
                this.state.id,
                "1111" + this.state.id,
                this.state.faculty,
                this.state.chair,
                encodeURIComponent(JSON.stringify(this.state.title)),
                encodeURIComponent(this.state.bio),
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
            case 'chair':
            case 'title':
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
                            <label htmlFor="feInputChair">Chair</label>
                            <FormSelect id="feInputChair" name="chair" value={this.state.chair ? this.state.chair: ''}  onChange={ this.handleUserInput }>
                                <option disabled={true} value=''>Select Chair</option>
                                {this.state.chairs.map((chair, index) => {
                                    return (<option  key={index} value={index}>{chair.name}</option>);
                                })}
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputTitle">Title</label>
                            <FormSelect id="feInputTitle" name="title" multiple={true} value={this.state.title}  onChange={ this.handleUserInputMulty }>
                                <option disabled={true} value={0}>Select Title</option>
                                <option  value={1}>Professor</option>
                                <option  value={2}>Doctor</option>
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feEmailAddress">Info</label>
                            <ReactQuill className="add-new-post__editor mb-1" name="info" value={this.state.bio || ''} invalid={ !!this.state.formErrors.info } onChange = {this.handleQuillChange}/>
                            <small  >{this.state.formErrors.info}</small>
                        </Col>
                    </Row>
                    {this.renderKey()}
                    <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                </Form>
            </div>
        );
    }
}
export default LecturerForm;
