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
    ListGroupItem, FormSelect
} from "shards-react";
import FacultyForm from "../../components/facultyForm/facultyForm";
import Faculties from "../../../contracts/Faculties";
import GroupMarks from "../../../contracts/GroupMarks";
import ArticlesABI from "../../../contracts/Articles";
import Students from "../../../contracts/Students";
import {Link} from "react-router-dom";
import Users from "../../../contracts/Users";

class UpdateMarks extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            mark: {
                id: '',
                faculty: '',
                group: '',
                year: '',
                half: 0,
                students: '',
                marks: [],
                article: '',
                lecturer: ''
            },
            faculty:{},
            article:{},
            contracts: {},
            students: []
        };

        let markId = props.match.params.id;
        this.getFaculty = this.getFaculty.bind(this);
        this.getMark = this.getMark.bind(this);
        this.getArticles = this.getArticles.bind(this);
        this.getFaculty = this.getFaculty.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.save = this.save.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.generateMarksList = this.generateMarksList.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getMark(markId).then(() => this.getStudents());
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
            articlesContract: articles,
            studentsContract: students,
            usersContract: users,
        };
    }

    handleUserInput = (e) => {
        let index = e.target.attributes.getNamedItem('data-index').value;
        const name = e.target.name;
        const value = e.target.value;
        let mark = this.state.mark;
        mark['marks'][index][name] = parseInt(value);
        mark['marks'][index]['total'] = (mark['marks'][index].first_exam === 1000 ? 0 : mark['marks'][index].first_exam) + (mark['marks'][index].second_exam === 1000 ? 0 : mark['marks'][index].second_exam) + (mark['marks'][index].final_exam === 1000 ? 0 : mark['marks'][index].final_exam);
        this.setState({mark: mark});
    }

    async getMark(_id) {
        const contract  = this.state.contracts.groupMarksContract;
        let mark = await contract.methods.getById(_id).call();
        mark = JSON.parse(mark);
        mark.marks = mark.marks ? JSON.parse(decodeURIComponent(mark.marks)) : [];
        mark.students = mark.students ? JSON.parse(decodeURIComponent(mark.students)) : [];

        let faculty = await this.getFaculty(mark.faculty);
        let article = await this.getArticles(faculty.id, mark);
        this.setState({mark: mark, faculty: faculty, article: article});
    }

    async getArticles(facultyId, mark){
        const contract  = this.state.contracts.articlesContract;
        let articles = await contract.methods.getFacultyArticles(facultyId).call();
        if(articles){
            articles = JSON.parse(JSON.parse(articles));
            let article = articles.find((article, index) => {
                return index === mark.article - 1;
            });

            return article;
        }
    }

    async getFaculty(_id) {
        const contract  = this.state.contracts.facultiesContract;
        let faculty = await contract.methods.getById(_id).call();
        faculty = JSON.parse(faculty);
        return faculty;
    }

    async getStudents() {
        //get all students
        const contract  = this.state.contracts.studentsContract;
        let students = await contract.methods.filter(this.state.faculty.id, this.state.mark.group).call();

        students = JSON.parse(students);

        let userContract = this.state.contracts.usersContract;
        for (let i = 0; i < students.length; i++){
            students[i].id = students[i].id.substring(4);
            let user = await userContract.methods.getById(students[i].id).call();
            students[i].name = JSON.parse(user).name;
        }

        students = students.filter(student => this.state.faculty.id == student.faculty);

        if(this.state.mark.students.length){
            students = students.filter(student => this.state.mark.students.indexOf("1111" + student.id) != -1);
        }

        this.setState({students: students});
    }

    async save(){
        const groupMarksContract  = this.state.contracts.groupMarksContract;
        groupMarksContract.methods.updateGroupMarks(
            this.state.mark.id,
            encodeURIComponent(JSON.stringify(this.state.mark.marks)),
            encodeURIComponent(JSON.stringify(this.state.mark.students))
        ).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
    };

    generateMarksList(student, index){
        let studentMark = this.state.mark.marks.find((mark, index) => mark.student === "1111" + student.id);

        return (<tr key={index}>
            <td>
                <div className="form-group">
                    {index + 1}
                </div>
            </td>
            <td>
                <div className="form-group">
                    <p>{student.name}</p>
                </div>
            </td>
            <td>
                <div className="form-group">
                    <FormSelect id="first_exam" name="first_exam" data-index={index} value={studentMark.first_exam }  onChange={ this.handleUserInput }>
                        <option value={1000}>Absent</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </FormSelect>
                </div>
            </td>
            <td>
                <div className="form-group">
                    <FormSelect id="second_exam" name="second_exam" data-index={index} value={studentMark.second_exam }  onChange={ this.handleUserInput }>
                        <option value={1000}>Absent</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </FormSelect>
                </div>
            </td>
            <td>
                <div className="form-group">
                    <FormSelect id="final_exam" name="final_exam" data-index={index} value={ studentMark.final_exam }  onChange={ this.handleUserInput }>
                        <option value={1000}>Absent</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                    </FormSelect>
                </div>
            </td>
            <td>
                <div className="form-group">
                    <p>
                        { studentMark.total }
                    </p>
                </div>
            </td>
        </tr>)
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Update Marks" subtitle="" className="text-sm-left" />
                </Row>
                <div className={'row bg-white'}>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputFaculty">FACULTY</label>
                        <p>{this.state.faculty.name}</p>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputFaculty">GROUP</label>
                        <p>{this.state.mark.group}</p>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputFaculty">YEAR</label>
                        <p>{this.state.mark.year}</p>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputFaculty">HALF</label>
                        <p>{this.state.mark.half}</p>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputFaculty">ARTICLE</label>
                        <p>{this.state.article.name}</p>
                    </Col>
                </div>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Marks</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            <table className="table mb-0">
                                                <thead className="bg-light">
                                                <tr>
                                                    <th scope="col" className="border-0">
                                                        #
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Student
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        1st exam
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        2nd exam
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Final exam
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Total
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.students.map((student, i) => {
                                                        return this.generateMarksList(student, i);
                                                    })}

                                                </tbody>
                                            </table>
                                            <Button className="mt-3 float-right" type="button" onClick={this.save}>Save</Button>
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
export default UpdateMarks;
