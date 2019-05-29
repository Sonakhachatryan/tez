import React from "react";
import PageTitle from "../../components/common/PageTitle";
import ArticlesABI from "../../../contracts/Articles.json";
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


class Articles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            facultyId: parseInt(window.loggedInUser.info.faculty),
            articles: [{
                name: '',
            }],
            formErrors: {
                articles: ''
            },
            contracts:{

            },
            isFormValid: false
        };

        this.connectToContracts().then(instance => {
            this.state.contracts.articlesContract = instance;
            this.getArticles(this.state.facultyId);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

        this.renderArticle = this.renderArticle.bind(this);
        this.addArticle = this.addArticle.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
        this.handleUserInputArticles = this.handleUserInputArticles.bind(this);
        this.save = this.save.bind(this);
        this.getArticles = this.getArticles.bind(this);
    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        const deployedNetwork = ArticlesABI.networks[networkId];
        const instance = new window.web3Provider.eth.Contract(
            ArticlesABI.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return instance;
    }

    handleUserInputArticles = (e) => {
        let index = e.target.attributes.getNamedItem('data-index').value;
        let allArticles = this.state.articles;
        allArticles[index].name = e.target.value;
        this.setState({articles: allArticles});
    }

    async getArticles(facultyId){
        console.log(facultyId);
        const contract  = this.state.contracts.articlesContract;
        let articles = await contract.methods.getFacultyArticles(facultyId).call();
        if(articles){
            articles = JSON.parse(JSON.parse(articles));
            this.setState({articles: articles});
        }
    }

    addArticle(){
        let allArticles = this.state.articles;
        allArticles.push({ name: ''});
        this.setState({articles : allArticles})
    }

    removeArticle(e){
        let index = e.target.attributes.getNamedItem('data-index').value;
        let allArticles = this.state.articles;
        allArticles.splice(index, 1);
        this.setState({articles : allArticles})
    }

    async save(){
        const contract  = this.state.contracts.articlesContract;
        let articlesString = JSON.stringify(this.state.articles);
        console.log(articlesString);
        contract.methods.saveFacultyArticles(this.state.facultyId, JSON.stringify(articlesString)).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
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

    renderArticle(value, index){
        if(this.state.articles.length === 1){
            return(
                <Row form key={index}>
                    <Col md="12">
                        <FormInput
                            id={"chair" + index}
                            type="text"
                            data-index={index}
                            placeholder="Article Name"
                            value={value.name}
                            onChange = {this.handleUserInputArticles}
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
                            placeholder="Article Name"
                            value={value.name}
                            onChange = {this.handleUserInputArticles}
                        />
                    </Col>
                    <Col md="2"><Button className="btn-danger" type="button" data-index={index} onClick={this.removeArticle}><i className="fa fa-minus"></i></Button></Col>
                </Row>
            )
        }

    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Articles" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Articles</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <img id={"url"}/>
                                    <Row>
                                        <Col>
                                            <Form>
                                                {this.state.articles.map((value, index) => {
                                                    return this.renderArticle(value, index);
                                                })}
                                                <Row form>
                                                    <Button className="mt-3 btn-success add-new-item" type="button" onClick={this.addArticle}><i className="fa fa-plus"></i></Button>
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
export default Articles;