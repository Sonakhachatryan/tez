import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Faculties from "../../../contracts/Faculties";

class AllFaculties extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            faculties: []
        }

        this.getFaculties = this.getFaculties.bind(this);
        this.deleteFaculty = this.deleteFaculty.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);

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
        let deployedNetwork = Faculties.networks[networkId];
        const faculties = new window.web3Provider.eth.Contract(
            Faculties.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            facultiesContract: faculties,
        };
    }

    async getFaculties() {
        const contract  = this.state.contracts.facultiesContract;
        let faculties = await contract.methods.getAll().call();
        faculties = JSON.parse(faculties);
        faculties.info = decodeURIComponent(faculties.info);
        faculties = faculties.filter((faculty, index) => faculty.id);
        this.setState({faculties: faculties});
    }

    async deleteFaculty(facultyId) {
        const contract = this.state.contracts.facultiesContract;
        await contract.methods.deleteFaculty(facultyId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        this.getFaculties();
    }


    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Faculties" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Add Faculty</h6>
                                <Link to={"/admin/faculty/add"}><button className="btn btn-success"><i className="fa fa-plus"></i></button></Link>

                            </CardHeader>
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            #
                                        </th>
                                        <th scope="col" className="border-0">
                                            Name
                                        </th>
                                        <th scope="col" className="border-0">
                                            Email
                                        </th>
                                        <th scope="col" className="border-0">
                                            Phone
                                        </th>
                                        <th scope="col" className="border-0">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.faculties.map((faculty, i) => {
                                        return (<tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{faculty.name}</td>
                                            <td>{faculty.email}</td>
                                            <td>{faculty.phone}</td>
                                            <td>
                                                <Link to={'/admin/faculty/edit/' + faculty.id } title="Edit"><i className="material-icons">edit</i></Link>
                                                <Link to={'/admin/faculty/chairs/' + faculty.id } title="Chairs"><i className="material-icons">vertical_split</i></Link>
                                                <a href='#' title="Delete" onClick={() => this.deleteFaculty(faculty.id)} ><i className="material-icons">delete</i></a>
                                            </td>
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
export default AllFaculties;
