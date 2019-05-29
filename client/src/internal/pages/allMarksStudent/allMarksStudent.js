import React from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormInput,
    FormFeedback,
    FormSelect,
    Form,
    Button
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import GroupMarks from "../../../contracts/GroupMarks";
import Faculties from "../../../contracts/Faculties";
import Lecturers from "../../../contracts/Lecturers";
import ArticlesABI from "../../../contracts/Articles";
import Students from "../../../contracts/Students";

class AllMarksStudent extends React.Component{
    constructor(props){
        super(props);
        let years = [];
        let currentYear = new Date().getFullYear();
        for(let i = 2010; i <= currentYear; i++){
            years.push(i);
        }
        this.state = {
            filter: {
                faculty: 0,
                group: '',
                year: currentYear,
                half: 0,
                article: '',
                lecturer: '',
                years: years,
                currentYear: currentYear,
                articles: [],
            },
            years: years,
            faculties: [],
            articles: [],
            student: {},
            lecturer: window.loggedInUser.role == 3 ?  "1111" + window.loggedInUser.id : '',
            marks: [],
            isAdmin: ["3", "4"].indexOf(window.loggedInUser.role) === -1 ? true : false,
        }

        this.getData = this.getData.bind(this);
        this.deleteMark = this.deleteMark.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.getLecturer = this.getLecturer.bind(this);
        this.getArticles = this.getArticles.bind(this);
        this.getFaculties = this.getFaculties.bind(this);


        this.connectToContracts().then(instances => {
            this.state.contracts = instances;

            if(window.loggedInUser.role == 3){
                let student = this.getStudent(window.loggedInUser.id);
                this.getData();
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

        return {
            groupMarksContract: groupMarks,
            facultiesContract: faculties,
            lecturersContract: lecturers,
            articlesContract: articles,
            studentsContract: students,
        };
    }
    0xce71B2e8CAbC1eef508dA7a5fefA2E97068324b9

    async getData() {
        const contract  = this.state.contracts.groupMarksContract;
        let marks = await contract.methods.filter(
            this.state.filter.faculty,
            this.state.filter.group,
            this.state.filter.year + '',
            this.state.filter.half,
            '',
            this.state.filter.lecturer,
        ).call();

        marks = JSON.parse(marks);

        let articles = this.state.articles;

        for(let i = 0; i < marks.length; i++){
            let mark = JSON.parse(decodeURIComponent(marks[i].marks));
            let studentMarks = mark.find((mark, index) => mark.student === "1111" + this.state.student.id);
            let facultyArticles = await this.getArticles(marks[i].faculty);
            let findArticles = articles.find((article, index) => article.id === marks[i].faculty + "_" +  marks[i].article);

            if(!findArticles) {
                articles.push({
                    id: marks[i].faculty + "_" +  marks[i].article,
                    name: facultyArticles[ marks[i].article - 1].name
                });
            }

            marks[i].newArticle = marks[i].faculty + "_" +  marks[i].article;
            marks[i].studentMarks = studentMarks;
        }

        if(this.state.filter.article){
            marks = marks.filter((item, index) => item.newArticle === this.state.filter.article);
        }

        this.setState({marks: marks, articles: articles});
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

    async getStudent(_id) {
        const studentsContract  = this.state.contracts.studentsContract;
        let studentData = await studentsContract.methods.getById(_id).call();
        studentData = JSON.parse(studentData);
        studentData.id = studentData.id.substring(4);

        let filter = this.state.filter;
        filter.group = studentData.group;

        this.setState({student: studentData, filter: filter});
    }

    async getArticles(facultyId){
        const contract  = this.state.contracts.articlesContract;
        let articles = await contract.methods.getFacultyArticles(facultyId).call();
        if(articles){
            articles = JSON.parse(JSON.parse(articles));
            return articles;
        }
    }

    async getFaculties() {
        const contract  = this.state.contracts.facultiesContract;
        let faculties = await contract.methods.getAll().call();
        faculties = JSON.parse(faculties);
        this.setState({faculties: faculties});
    }

    async deleteMark(markId) {
        const contract = this.state.contracts.groupMarksContract;
        await contract.methods.deleteGroupMark(markId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        this.getData();
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let filter = this.state.filter;
        filter[name] = value;
        this.setState({filter: filter});
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Marks" subtitle="" className="text-sm-left" />
                </Row>
                <div className={'row bg-white'}>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputYear">Year</label>
                        <FormSelect id="feInputYear" name="year" value={this.state.filter.year ? this.state.filter.year : this.state.filter.currentYear}  onChange={ this.handleUserInput }>
                            <option value={0}>Select Year</option>
                            {this.state.years.map((item, index) => {
                                return (<option key={index} value={item}>{item}</option>);
                            })}
                        </FormSelect>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputHalf">Half</label>
                        <FormSelect id="feInputHalf" name="half" value={this.state.filter.half}  onChange={ this.handleUserInput }>
                            <option value={0}>Select half</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                        </FormSelect>
                    </Col>
                    <Col md="2" className="form-group">
                        <label htmlFor="feInputArticle">Article</label>
                        <FormSelect id="feInputArticle" name="article" value={this.state.filter.article}  onChange={ this.handleUserInput }>
                            <option value="">Select Article</option>
                            {this.state.articles.map((article, index) => {
                                return (<option key={index} value={article.id}>{article.name}</option>);
                            })}
                        </FormSelect>
                    </Col>
                    <Col md="2" className="form-group">
                        <Button className="mt-4 mb-47" type="button" onClick={this.getData}>Go!</Button>
                    </Col>
                </div>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Marks</h6>
                            </CardHeader>
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            #
                                        </th>
                                        <th scope="col" className="border-0">
                                            Year
                                        </th>
                                        <th scope="col" className="border-0">
                                            Half
                                        </th>
                                        <th scope="col" className="border-0">
                                            Article
                                        </th>
                                        <th scope="col" className="border-0">
                                            First Exam
                                        </th>
                                        <th scope="col" className="border-0">
                                            Second Exam
                                        </th>
                                        <th scope="col" className="border-0">
                                            Final Exam
                                        </th>
                                        <th scope="col" className="border-0">
                                            Total
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.marks.map((mark, i) => {
                                        return (<tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{mark.year}</td>
                                            <td>{mark.half}</td>
                                            <td>{this.state.articles.find((item,index) => item.id === mark.newArticle).name}</td>
                                            <td>{mark.studentMarks.first_exam === 1000 ? "Absent" : mark.studentMarks.first_exam}</td>
                                            <td>{mark.studentMarks.second_exam === 1000 ? "Absent" : mark.studentMarks.second_exam}</td>
                                            <td>{mark.studentMarks.final_exam === 1000 ? "Absent" : mark.studentMarks.final_exam}</td>
                                            <td>{mark.studentMarks.total === 1000 ? "Absent" : mark.studentMarks.total}</td>
                                        </tr>)
                                    })}

                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default AllMarksStudent;
