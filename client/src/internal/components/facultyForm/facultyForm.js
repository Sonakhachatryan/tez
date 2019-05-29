import React from "react";
import Faculties from "../../../contracts/Faculties.json";
import { Buffer } from 'buffer';
import {
    Button,
    Col,
    Row,
    Form,
    FormInput, FormFeedback,
} from "shards-react";
import ReactQuill from "react-quill";

class FacultyForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.faculty.id,
            name: this.props.faculty.name,
            shortDesc: this.props.faculty.shortDesc,
            image: this.props.faculty.img,
            phone: this.props.faculty.phone,
            email: this.props.faculty.email,
            info: this.props.faculty.info,
            contracts: {},
            formErrors: {
                name:'',
                image: '',
                phone: '',
                email: '',
                info: '',
            },
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances
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

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name,value);
    }

    handleQuillChange(value){
        this.setState({info: value});
        this.validateField("info", value);
    }

    async save(){
        //upload image to ipfs and return hash
        const photo = document.getElementById("image");
        let url = this.state.image;
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

        this.setState({image: url});
        const contract  = this.state.contracts.facultiesContract;
        if(this.state.id){
            await contract.methods.updateFaculty(this.state.id, this.state.name, this.state.shortDesc, encodeURIComponent(this.state.info), this.state.image, this.state.phone, this.state.email).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }else{
            await contract.methods.createFaculty(this.state.name, this.state.shortDesc, encodeURIComponent(this.state.info), this.state.image, this.state.phone, this.state.email).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        }
        this.props.history.push('/admin/faculty/all');
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'email':
                let emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Email is invalid.';
                if(!emailValid) {
                    errorsCount++ ;
                }
                break;
            case 'name':
            case 'shortDesc':
            case 'phone':
            case 'info':
            case 'image':
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

    render(){
        return(
            <Form>
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
                        <label htmlFor="shortDesc">Short description</label>
                        <FormInput
                            id="shortDesc"
                            name="shortDesc"
                            type="text"
                            value={this.state.shortDesc}
                            placeholder="Short description"
                            onChange={ this.handleUserInput }
                            invalid={ !!this.state.formErrors.shortDesc }
                        />
                        <FormFeedback>{this.state.formErrors.shortDesc}</FormFeedback>
                    </Col>
                </Row>
                <Row form>
                    <Col md="12" className="form-group">
                        <label htmlFor="image">Image</label>
                        <FormInput
                            id="image"
                            name="image"
                            type="file"
                            placeholder="Image"
                            onChange = {this.handleUserInput}
                            invalid={ !!this.state.formErrors.image }
                        />
                        <FormFeedback>{this.state.formErrors.image}</FormFeedback>
                    </Col>
                </Row>
                <Row form>
                    <Col md="6" className="form-group">
                        <label htmlFor="feEmailAddress">Email</label>
                        <FormInput
                            id="feEmailAddress"
                            name="email"
                            type="email"
                            value={this.state.email}
                            placeholder="Email"
                            onChange = {this.handleUserInput}
                            invalid={ !!this.state.formErrors.email }
                        />
                        <FormFeedback>{this.state.formErrors.email}</FormFeedback>
                    </Col>
                    <Col md="6">
                        <label htmlFor="phone">Phone</label>
                        <FormInput
                            id="phone"
                            name="phone"
                            type="text"
                            value={this.state.phone}
                            placeholder="Phone"
                            onChange = {this.handleUserInput}
                            invalid={ !!this.state.formErrors.phone  }
                        />
                        <FormFeedback>{this.state.formErrors.phone}</FormFeedback>
                    </Col>
                </Row>
                <Row form>
                    <Col md="12" className="form-group">
                        <label htmlFor="feEmailAddress">Info</label>
                        <ReactQuill className="add-new-post__editor mb-1" name="info" value={this.state.info || ''} invalid={ !!this.state.formErrors.info } onChange = {this.handleQuillChange}/>
                        <small  >{this.state.formErrors.info}</small>
                    </Col>
                </Row>
                <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
            </Form>
        );
    }
}
export default FacultyForm;
