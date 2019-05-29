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
import GroupMarks from "../../../contracts/GroupMarks";
import Faculties from "../../../contracts/Faculties";
import Lecturers from "../../../contracts/Lecturers";
import ArticlesABI from "../../../contracts/Articles.json";

class MarksForm extends React.Component{
    constructor(props){
        super(props);
        let years = [];
        let currentYear = new Date().getFullYear();
        for(let i = 2010; i <= currentYear; i++){
            years.push(i);
        }
        this.state = {
            id: this.props.mark.id,
            faculty: this.props.mark.faculty,
            group: this.props.mark.group,
            year: this.props.mark.year ? this.props.mark.year : currentYear,
            half: this.props.mark.half,
            students: this.props.mark.students,
            marks: this.props.mark.marks,
            article: this.props.mark.article,
            lecturer: this.props.mark.lecturer,
            contracts: {},
            faculties: [],
            years: years,
            currentYear: currentYear,
            articles: [],
            formErrors: {
                id: '',
                faculty:'',
                group: '',
                year:'',
                half:'',
                students: '',
                marks: '',
                article: '',
                lecturer: ''

            },
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateField = this.validateField.bind(this);
        this.save = this.save.bind(this);
        this.getLecturer = this.getLecturer.bind(this);
        this.getArticles = this.getArticles.bind(this);
        this.getFaculties = this.getFaculties.bind(this);
        this.getStudents = this.getStudents.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getFaculties();

            if(window.loggedInUser.role == 4){
                this.getLecturer(window.loggedInUser.id);
            }

            if(this.state.faculty){
                this.getArticles(this.state.faculty);
            }
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });
    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = GroupMarks.networks[networkId];
        const groupMarks = new window.web3Provider.eth.Contract(
            GroupMarks.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = Faculties.networks[networkId];
        const faculties = new window.web3Provider.eth.Contract(
            Faculties.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = Lecturers.networks[networkId];
        const lecturers = new window.web3Provider.eth.Contract(
            Lecturers.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = ArticlesABI.networks[networkId];
        const articles = new window.web3Provider.eth.Contract(
            ArticlesABI.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = Students.networks[networkId];
        const students = new window.web3Provider.eth.Contract(
            Students.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = Users.networks[networkId];
        const users = new window.web3Provider.eth.Contract(
            Users.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            groupMarksContract: groupMarks,
            facultiesContract: faculties,
            lecturersContract: lecturers,
            articlesContract: articles,
            studentsContract: students,
            usersContract: users,
        };
    }

    async getLecturer(_id) {
        const lecturersContract  = this.state.contracts.lecturersContract;
        let lecturerData = await lecturersContract.methods.getById(_id).call();
        lecturerData = JSON.parse(lecturerData);
        lecturerData.id = lecturerData.id.substring(4);
        lecturerData.bio = decodeURIComponent(lecturerData.bio);
        lecturerData.title = JSON.parse(decodeURIComponent(lecturerData.title));

        if(!this.state.faculty){
            this.setState({lecturer: lecturerData, faculty: lecturerData.faculty});
        }else{
            this.setState({lecturer: lecturerData});
        }

        this.getArticles(lecturerData.faculty);
    }

    async getArticles(facultyId){
        const contract  = this.state.contracts.articlesContract;
        let articles = await contract.methods.getFacultyArticles(facultyId).call();
        if(articles){
            articles = JSON.parse(JSON.parse(articles));
            this.setState({articles: articles});
        }
    }

    async getFaculties() {
        const contract  = this.state.contracts.facultiesContract;
        let faculties = await contract.methods.getAll().call();
        faculties = JSON.parse(faculties);
        this.setState({faculties: faculties});
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name,value);
        if(name === "faculty"){
            this.setState({article: ''});
            this.getArticles(this.state.faculty);
        }
    }

    async save(){
         let students = await this.getStudents();

         let studentIds = [];
         let marks = [];

         for (let i = 0; i < students.length; i++) {
             studentIds.push(students[i].id);
             marks.push({
                 student: students[i].id,
                 first_exam: 0,
                 second_exam: 0,
                 final_exam: 0,
                 total: 0,
             });
         }

         const groupMarksContract  = this.state.contracts.groupMarksContract;
         groupMarksContract.methods.createGroupMarks(
            this.state.faculty,
            this.state.group,
            this.state.year+'',
            parseInt(this.state.half),
            encodeURIComponent(JSON.stringify(studentIds)),
            encodeURIComponent(JSON.stringify(marks)),
            parseInt(this.state.article),
            "1111" + this.state.lecturer.id,
        ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'faculty':
            case 'group':
            case 'year':
            case 'half':
            case 'article':
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

    async getStudents() {
        //get all students
        const contract  = this.state.contracts.studentsContract;
        let students = await contract.methods.filter(this.state.faculty, this.state.group).call();
        students = JSON.parse(students);

        return students;
    }

    render(){
        return(
            <div>
                <Form>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputFaculty">Faculty</label>
                            <FormSelect id="feInputFaculty" name="faculty" value={this.state.faculty ? this.state.faculty : this.state.lecturer.faculty}  onChange={ this.handleUserInput }>
                                <option disabled={true} value={0}>Select Faculty</option>
                                {this.state.faculties.map((faculty, index) => {
                                    return (<option key={index} value={faculty.id}>{faculty.name}</option>);
                                })}
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
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputYear">Year</label>
                            <FormSelect id="feInputYear" name="year" value={this.state.year ? this.state.year : this.state.currentYear}  onChange={ this.handleUserInput }>
                                <option disabled={true} value={0}>Select Year</option>
                                {this.state.years.map((item, index) => {
                                    return (<option key={index} value={item}>{item}</option>);
                                })}
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputHalf">Half</label>
                            <FormSelect id="feInputHalf" name="half" value={this.state.half}  onChange={ this.handleUserInput }>
                                <option disabled={true} value={0}>Select half</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </FormSelect>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="feInputArticle">Article</label>
                            <FormSelect id="feInputArticle" name="article" value={this.state.article}  onChange={ this.handleUserInput }>
                                <option disabled={true} value="">Select Article</option>
                                {this.state.articles.map((article, index) => {
                                    return (<option key={index} value={index + 1}>{article.name}</option>);
                                })}
                            </FormSelect>
                        </Col>
                    </Row>
                    <Button className="mt-3" type="button" onClick={this.save}>Save</Button>
                </Form>
            </div>
        );
    }
}
export default MarksForm;
