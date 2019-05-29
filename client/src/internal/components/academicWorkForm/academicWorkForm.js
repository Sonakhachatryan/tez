import React from "react";
import AcademicWorks from "../../../contracts/AcademicWorks.json";
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
import AcademicWorkType from "../common/AcademicWorkType";

class AcademicWorkForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.work.id,
            userAddress: this.props.work.userAddress ? this.props.work.userAddress : window.loggedInUser.id,
            title: this.props.work.title,
            publish_date: this.props.work.publish_date,
            type: this.props.work.type,
            files: this.props.work.files,
            desc: this.props.work.desc,
            contracts: {},
            types: (new AcademicWorkType({})).types,
            formErrors: {
                id: '',
                title:'',
                publish_date: '',
                desc: '',
            },
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);
        this.handleUserInputMulty = this.handleUserInputMulty.bind(this);
        this.removeFile = this.removeFile.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
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

    removeFile(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let allFiles = this.state.files;
        allFiles.splice(index, 1);
        this.setState({files : allFiles})
    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = AcademicWorks.networks[networkId];
        const academicWorks = new window.web3Provider.eth.Contract(
            AcademicWorks.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            academicWorksContract: academicWorks
        };
    }

    handleQuillChange(value){
        this.setState({desc: value});
        this.validateField("desc", value);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name,value);
    }

    fileUploadGetUrl(file) {
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onloadend = function() {
                const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
                const buf = Buffer.from(fileReader.result) // Convert data into buffer
                ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
                    if(err) {
                        console.error(err)
                        return
                    }
                    console.log('tt', result[0].hash)
                    return resolve(`https://ipfs.io/ipfs/${result[0].hash}`);
                })
            }
            fileReader.readAsArrayBuffer(file);
        });
    }

    async save(){
        let urls = this.state.files;
        const photo = document.getElementById("filesInput");
        if(photo.files.length){
            const photo = document.getElementById("filesInput");
            for(let i = 0; i < photo.files.length; i++){
                console.log(i);
                urls.push(await this.fileUploadGetUrl(photo.files[i]));
            }
        }
        this.setState({files: urls});

        const academicWorksContract  = this.state.contracts.academicWorksContract;
        if(this.state.id){
            academicWorksContract.methods.updateAcademicWork(
                this.state.id,
                "1111" + this.state.userAddress,
                this.state.title,
                this.state.publish_date,
                this.state.type,
                encodeURIComponent(JSON.stringify(this.state.files)),
                encodeURIComponent(this.state.desc)
            ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});

        }else{

            academicWorksContract.methods.createAcademicWork(
                "1111" + this.state.userAddress,
                this.state.title,
                this.state.publish_date,
                this.state.type,
                encodeURIComponent(JSON.stringify(this.state.files)),
                encodeURIComponent(this.state.desc)
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

    render(){
        return(
            <div>
                <img src={this.state.photo}  className={'img-thumbnail w-25 h-25 mb-2 ml-2 ' + (this.state.photo ? ' d-block' : ' d-none')} />
                <Form>
                    <Row form className={ this.state.isSet ? ' d-none' : ''}>
                        <Col md="12" className="form-group">
                            <label htmlFor="name">Title</label>
                            <FormInput
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Title"
                                value={this.state.title}
                                onChange={ this.handleUserInput }
                                invalid={ !!this.state.formErrors.title }
                            />
                            <FormFeedback>{this.state.formErrors.title}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="image">Publish Date</label>
                            <FormInput
                                id="publish_date"
                                name="publish_date"
                                type="date"
                                placeholder="Image"
                                value={this.state.publish_date}
                                onChange = {this.handleUserInput}
                                invalid={ !!this.state.formErrors.publish_date }
                            />
                            <FormFeedback>{this.state.formErrors.publish_date}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="image">Files</label>
                            <FormInput
                                id="filesInput"
                                name="filesInput"
                                type="file"
                                placeholder="Files"
                                multiple={true}
                                onChange = {this.handleUserInput}
                                invalid={ !!this.state.formErrors.photo }
                            />
                            <FormFeedback>{this.state.formErrors.photo}</FormFeedback>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputType">Type</label>
                            <FormSelect id="feInputType" name="type" value={this.state.type ? this.state.type: ''}  onChange={ this.handleUserInput }>
                                <option disabled={true} value=''>Select Work Type </option>
                                {this.state.types.map((type, index) => {
                                    return (<option  key={index} value={type.id}>{type.name}</option>);
                                })}
                            </FormSelect>
                        </Col>
                    </Row>
                    <label htmlFor="feEmailAddress">Files</label>
                    {this.state.files.map((item, index) => {
                        return (
                            <Row form className="mt-2" key={index}>
                            <Col md="10">
                                <a href={item} target="_blank">{item}</a>
                            </Col>
                            <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={this.removeFile}><i className="fa fa-minus"></i></Button></Col>
                           </Row>
                         );
                    })}
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feEmailAddress">Description</label>
                            <ReactQuill className="add-new-post__editor mb-1" name="desc" value={this.state.desc || ''} invalid={ !!this.state.formErrors.desc } onChange = {this.handleQuillChange}/>
                            <small  >{this.state.formErrors.desc}</small>
                        </Col>
                    </Row>
                    <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                </Form>
            </div>
        );
    }
}
export default AcademicWorkForm;
