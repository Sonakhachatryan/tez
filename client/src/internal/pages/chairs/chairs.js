import React from "react";
import PageTitle from "../../components/common/PageTitle";
import ChairsABI from "../../../contracts/Chairs.json";
import {
    Button,
    Card,
    Col,
    Row,
    Container,
    CardHeader,
    Form,
    FormInput,
    ListGroup,
    ListGroupItem
} from "shards-react";


class Chairs extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            facultyId: props.match.params.id,
            chairs: [{
                name: '',
            }],
            formErrors: {
                chairs: ''
            },
            contracts:{

            },
            isFormValid: false
        };

        this.connectToContracts().then(instance => {
            this.state.contracts.chairsContract = instance;
            this.getChairs(props.match.params.id);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

        this.renderChair = this.renderChair.bind(this);
        this.addChair = this.addChair.bind(this);
        this.removeChair = this.removeChair.bind(this);
        this.handleUserInputChairs = this.handleUserInputChairs.bind(this);
        this.save = this.save.bind(this);
        this.getChairs = this.getChairs.bind(this);
    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        const deployedNetwork = ChairsABI.networks[networkId];
        const instance = new window.web3Provider.eth.Contract(
            ChairsABI.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return instance;
    }

    handleUserInputChairs = (e) => {
        let index = e.target.attributes.getNamedItem('data-index').value;
        let allChairs = this.state.chairs;
        allChairs[index].name = e.target.value;
        this.setState({chairs: allChairs});
    }

    async getChairs(facultyId){
        const contract  = this.state.contracts.chairsContract;
        let chairs = await contract.methods.getFacultyChairs(facultyId).call();
        if(chairs){
            chairs = JSON.parse(JSON.parse(chairs));
            this.setState({chairs: chairs});
        }
    }

    addChair(){
        let allChairs = this.state.chairs;
        allChairs.push({ name: ''});
        this.setState({chairs : allChairs})
    }

    removeChair(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let allChairs = this.state.chairs;
        allChairs.splice(index, 1);
        this.setState({chairs : allChairs})
    }

    async save(){
        const contract  = this.state.contracts.chairsContract;
        let chairsString = JSON.stringify(this.state.chairs);
        console.log(chairsString);
        contract.methods.saveFacultyChairs(this.state.facultyId, JSON.stringify(chairsString)).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
    };


    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'email':
                let emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
                if(!emailValid) {
                    errorsCount++ ;
                }
                break;
            case 'name':
            case 'phone':
            case 'info':
            case 'image':
                let fieldIsValid = value.length !== 0;
                fieldValidationErrors[fieldName] = fieldIsValid ? '': 'Field is required';
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

    renderChair(value, index){
        if(this.state.chairs.length === 1){
            return(
                <Row form key={index}>
                    <Col md="12">
                        <FormInput
                            id={"chair" + index}
                            type="text"
                            data-index={index}
                            placeholder="Chair Name"
                            value={value.name}
                            onChange = {this.handleUserInputChairs}
                        />
                    </Col>
                </Row>
            )
        }else{
            return(
                <Row className={"mb-2"} form key={index}>
                    <Col md="10">
                        <FormInput
                            id={"chair" + index}
                            type="text"
                            data-index={index}
                            placeholder="Chair Name"
                            value={value.name}
                            onChange = {this.handleUserInputChairs}
                        />
                    </Col>
                    <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={this.removeChair}><i className="fa fa-minus"></i></Button></Col>
                </Row>
            )
        }

    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Chairs" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Chairs</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <img id={"url"}/>
                                    <Row>
                                        <Col>
                                            <Form>
                                                {this.state.chairs.map((value, index) => {
                                                    return this.renderChair(value, index);
                                                })}
                                                <Row form>
                                                    <Button className="mt-3 btn-success add-new-item" type="button" onClick={this.addChair}><i className="fa fa-plus"></i></Button>
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
export default Chairs;