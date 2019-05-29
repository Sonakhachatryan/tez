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
    FormTextarea,
    ListGroupItem, FormFeedback, Form
} from "shards-react";
import InfoContract from "../../../contracts/Info";
import ReactQuill from "react-quill";
import {Buffer} from "buffer";

class Info extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            addresses: '',
            emails: [''],
            phones: [''],
            sections: [
                {
                  image: '',
                  title: '',
                  body: '',
                }
            ],
            locationCoordinates: {
                latitude: '',
                longitude: ''
            },
            socialLinks: {
                facebook: '',
                twitter: '',
                linkedin: ''
            },
            formErrors: {},
            contracts: {},
        };

        this.getData = this.getData.bind(this);
        this.renderPhone = this.renderPhone.bind(this);
        this.addPhone = this.addPhone.bind(this);
        this.removePhone = this.removePhone.bind(this);
        this.handleUserInputPhones = this.handleUserInputPhones.bind(this);
        this.renderEmail= this.renderEmail.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
        this.handleUserInputEmails = this.handleUserInputEmails.bind(this);
        this.renderSections = this.renderSections.bind(this);
        this.addSection = this.addSection.bind(this);
        this.removeSection = this.removeSection.bind(this);
        this.handleUserInputFile = this.handleUserInputFile.bind(this);
        this.handleUserInputSection = this.handleUserInputSection.bind(this);
        this.save = this.save.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getData();
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = InfoContract.networks[networkId];
        const info = new window.web3Provider.eth.Contract(
            InfoContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            infoContract: info,
        };
    }

    async getData() {
        const contract  = this.state.contracts.infoContract;
        let data = await contract.methods.getData().call();
        data = JSON.parse(data);

        let obj = {
            addresses: data.addresses
        };

        if(data.emails.length){
            obj.emails = data.emails;
        }

        if(data.phones.length){
            obj.phones = data.phones;
        }

        if(data.sections.length){
            obj.sections = data.sections;
        }

        if(typeof data.locationCoordinates === 'object'){
            obj.locationCoordinates = data.locationCoordinates;
        }

        if(typeof data.socialLinks === 'object'){
            obj.socialLinks = data.socialLinks;
        }

        this.setState(obj);

    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let dataProp = e.target.attributes.getNamedItem('data-prop');
        if(dataProp){
            let item = this.state[dataProp.value];
            item[name] = value;
            this.setState({[dataProp.value]: item});
        }else{
            this.setState({[name]: value});
        }

        // this.validateField(name,value);
    }

    renderPhone(value, index){
        if(this.state.phones.length === 1){
            return(
                <Row form key={index}>
                    <Col md="12">
                        <FormInput
                            id={"phone" + index}
                            type="text"
                            data-index={index}
                            placeholder="Phone number"
                            value={value}
                            onChange = {this.handleUserInputPhones}
                        />
                    </Col>
                </Row>
            )
        }else{
            return(
                <Row className={"mb-2"} form key={index}>
                    <Col md="10">
                        <FormInput
                            id={"phone" + index}
                            type="text"
                            data-index={index}
                            placeholder="Phone number"
                            value={value}
                            onChange = {this.handleUserInputPhones}
                        />
                    </Col>
                    <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={ this.removePhone }><i className="fa fa-minus"></i></Button></Col>
                </Row>
            )
        }

    }

    addPhone(){
        let phones = this.state.phones;
        phones.push('');
        this.setState({phones : phones})
    }

    removePhone(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let phones = this.state.phones;
        phones.splice(index,1);
        this.setState({phones: phones});
    }

    handleUserInputPhones(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let phones = this.state.phones;
        phones[index] = e.target.value;
        this.setState({phones: phones});
    }

    renderEmail(value, index){
        if(this.state.emails.length === 1){
            return(
                <Row form key={index}>
                    <Col md="12">
                        <FormInput
                            id={"email" + index}
                            type="text"
                            data-index={index}
                            placeholder="Email"
                            value={value}
                            onChange = {this.handleUserInputEmails}
                        />
                    </Col>
                </Row>
            )
        }else{
            return(
                <Row className={"mb-2"} form key={index}>
                    <Col md="10">
                        <FormInput
                            id={"email" + index}
                            type="text"
                            data-index={index}
                            placeholder="Email"
                            value={value}
                            onChange = {this.handleUserInputEmails}
                        />
                    </Col>
                    <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={ this.removeEmail}><i className="fa fa-minus"></i></Button></Col>
                </Row>
            )
        }

    }

    addEmail(){
        let emails = this.state.emails;
        emails.push('');
        this.setState({emails : emails})
    }

    removeEmail(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let emails = this.state.emails;
        emails.splice(index,1);
        this.setState({emails: emails});
    }

    handleUserInputEmails(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let emails = this.state.emails;
        emails[index] = e.target.value;
        this.setState({emails: emails});
    }

    renderSections(section, index){
        if(this.state.sections.length === 1){
            return(
                <Row form key={index} >
                    <img src={section.image}  className={'img-thumbnail w-25 h-25 mb-2 ml-2' + (section.image ? ' d-block' : ' d-none')} />
                    <Col md="6">
                        <FormInput
                            id={"title" + index}
                            type="text"
                            data-index={index}
                            placeholder="Section Title"
                            value={section.title}
                            data-prop="title"
                            onChange = {this.handleUserInputSection}
                        />
                    </Col>
                    <Col md="6">
                        <FormInput
                            id={"file" + index}
                            type="file"
                            data-index={index}
                            placeholder="File"
                            className={'file'}
                            data-prop="file"
                            onChange = {this.handleUserInputFile}
                        />
                    </Col>
                    <Col md="12">
                        <label>Body</label>
                        <FormTextarea
                            id={"body" + index}
                            value={section.body}
                            data-index={index}
                            placeholder="body"
                            data-prop="body"
                            onChange = {this.handleUserInputSection}
                        />
                    </Col>
                </Row>
            )
        }else{
            return(
                <Row form key={index} className="mt-5">
                    <img src={section.image} className={'img-thumbnail w-25 h-25 mb-2 ml-2' + (section.image ? ' d-block' : ' d-none')} />
                    <Col md="10">
                        <FormInput
                            id={"title" + index}
                            type="text"
                            data-index={index}
                            placeholder="Section Title"
                            value={section.title}
                            data-prop="title"
                            onChange = {this.handleUserInputSection}
                        />
                        <FormInput
                            id={"file" + index}
                            type="file"
                            data-index={index}
                            placeholder="File"
                            className={'file'}
                            data-prop="file"
                            onChange = {this.handleUserInputSection}
                        />
                        <label>Body</label>
                        <FormTextarea
                            id={"body" + index}
                            data-index={index}
                            placeholder="body"
                            value={section.body}
                            data-prop="body"
                            onChange = {this.handleUserInputSection}
                        />
                    </Col>
                    <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={ this.removeSection }><i className="fa fa-minus"></i></Button></Col>
                    <hr/>
                </Row>
            )
        }
    }

    addSection(){
        let sections = this.state.sections;
        sections.push({
            image: '',
            title: '',
            body: '',
        });
        this.setState({sections : sections})
    }

    removeSection(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let sections = this.state.sections;
        sections.splice(index,1);
        this.setState({sections: sections});
    }

    handleUserInputSection(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let dataProp = e.target.attributes.getNamedItem('data-prop').value;
        let sections = this.state.sections;
        if(dataProp === 'title' || dataProp === 'body'){
            sections[index][dataProp] = e.target.value;
        }
        this.setState({sections: sections});
    }

    handleUserInputFile(e, index){
    }

    async save(){

        const fiels = document.getElementsByClassName("file");
        let urls = [];
        for(let i = 0; i < fiels.length; i++ ){
            if(fiels[i].files.length){
                let url = await new Promise((resolve) => {
                    let fileReader = new FileReader();
                    fileReader.onloadend = function() {
                        const ipfs = window.IpfsApi('localhost', 5001); // Connect to IPFS
                        const buf = Buffer.from(fileReader.result); // Convert data into buffer
                        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
                            if(err) {
                                console.error(err);
                                return
                            }
                            return resolve(`https://ipfs.io/ipfs/${result[0].hash}`);
                        })
                    };
                    const photo = fiels[i];
                    fileReader.readAsArrayBuffer(photo.files[0]);
                });

                let sections = this.state.sections;
                sections[fiels[i].getAttribute('data-index')].image = url;
                this.setState({sections: sections});
            }
        }

        const contract  = this.state.contracts.infoContract;
        contract.methods.save(this.state.addresses, JSON.stringify(this.state.phones), JSON.stringify(this.state.emails),JSON.stringify(this.state.sections), JSON.stringify(this.state.locationCoordinates), JSON.stringify(this.state.socialLinks)).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="University info" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Info</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            <Form>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Address</label>
                                                        <FormInput
                                                            id="name"
                                                            name="addresses"
                                                            type="text"
                                                            placeholder="Address"
                                                            value={this.state.addresses}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.address }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.address}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Latitude</label>
                                                        <FormInput
                                                            id="latitude"
                                                            name="latitude"
                                                            type="text"
                                                            placeholder="Latitude"
                                                            data-prop="locationCoordinates"
                                                            value={this.state.locationCoordinates.latitude}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.locationCoordinates }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.locationCoordinates}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Longitude</label>
                                                        <FormInput
                                                            id="longitude"
                                                            name="longitude"
                                                            type="text"
                                                            placeholder="Longitude"
                                                            data-prop="locationCoordinates"
                                                            value={this.state.locationCoordinates.longitude}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.locationCoordinates }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.locationCoordinates}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                <h3>Social Links</h3>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Facebook</label>
                                                        <FormInput
                                                            id="facebook"
                                                            name="facebook"
                                                            type="text"
                                                            placeholder="Facebook"
                                                            data-prop="socialLinks"
                                                            value={this.state.socialLinks.fcaebook}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.socialLinks }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.socialLinks}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Twitter</label>
                                                        <FormInput
                                                            id="twitter"
                                                            name="twitter"
                                                            type="text"
                                                            placeholder="Twitter"
                                                            data-prop="socialLinks"
                                                            value={this.state.socialLinks.twitter}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.socialLinks }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.socialLinks}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <Row form>
                                                    <Col md="12" className="form-group">
                                                        <label htmlFor="name">Linked In</label>
                                                        <FormInput
                                                            id="linkedin"
                                                            name="linkedin"
                                                            type="text"
                                                            placeholder="Linked In"
                                                            data-prop="socialLinks"
                                                            value={this.state.socialLinks.linkedin}
                                                            onChange={ this.handleUserInput }
                                                            invalid={ !!this.state.formErrors.socialLinks }
                                                        />
                                                        <FormFeedback>{this.state.formErrors.socialLinks}</FormFeedback>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                    <h3>Phones</h3>

                                                    {this.state.phones.map((value, index) => {
                                                        return this.renderPhone(value, index);
                                                    })}
                                                 <Row form>
                                                    <Button className="mt-3 btn-success add-new-item" type="button" onClick={this.addPhone}><i className="fa fa-plus"></i></Button>
                                                 </Row>
                                                <hr/>
                                                    <h3>Emails</h3>

                                                    {this.state.emails.map((value, index) => {
                                                        return this.renderEmail(value, index);
                                                    })}
                                                 <Row form>
                                                    <Button className="mt-3 btn-success add-new-item" type="button" onClick={this.addEmail}><i className="fa fa-plus"></i></Button>
                                                 </Row>
                                                <hr/>
                                                <h3>Sections</h3>

                                                {this.state.sections.map((value, index) => {
                                                    return this.renderSections(value, index);
                                                })}
                                                <Row form>
                                                    <Button className="mt-3 btn-success add-new-item" type="button" onClick={this.addSection}><i className="fa fa-plus"></i></Button>
                                                </Row>
                                                <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                                            </Form>
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
export default Info;
