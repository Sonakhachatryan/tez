import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Users from "../../../contracts/Users";
import AcademicWorks from "../../../contracts/AcademicWorks";
import RoleText from "../../components/common/RoleText";
import AcademicWorkType from "../../components/common/AcademicWorkType";

class AllAcademicWorks extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            academicWorks: [],
            types: (new AcademicWorkType({})).types,
            userId: ["3", "4"].indexOf(window.loggedInUser.role) === -1 ? '1111' + props.match.params.id : '1111' + window.loggedInUser.id,
            isAdmin: ["3", "4"].indexOf(window.loggedInUser.role) === -1 ? true : false,
        }

        this.getByUserAddress = this.getByUserAddress.bind(this);
        this.deleteWork = this.deleteWork.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.renderTypeText = this.renderTypeText.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getByUserAddress(this.state.userId);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = Users.networks[networkId];
        const users = new window.web3Provider.eth.Contract(
            Users.abi,
            deployedNetwork && deployedNetwork.address,
        );

        deployedNetwork = AcademicWorks.networks[networkId];
        const academicWorks = new window.web3Provider.eth.Contract(
            AcademicWorks.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            usersContract: users,
            academicWorksContract: academicWorks,
        };
    }

    async getByUserAddress(userId) {
        const contract  = this.state.contracts.academicWorksContract;
        let academicWorks = await contract.methods.getByUserAddress(userId).call();

        academicWorks = JSON.parse(academicWorks);
        academicWorks.map((item, index) =>  {
            academicWorks[index].userAddress = item.userAddress.substring(4);
        });

        this.setState({academicWorks: academicWorks});
    }

    renderTypeText(typeId){
        let item = this.state.types.find((item, index) => {
            return item.id == typeId;
        });

        if(item){
            return item.name;
        }

        return '';
    }

    async deleteWork(workId) {
        const contract = this.state.contracts.academicWorksContract;
        await contract.methods.deleteAcademicWork(workId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        this.getByUserAddress(this.state.userId);
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Academic Works" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Add Academic Work</h6>
                                <Link to={"/admin/academic-work/add"}><button className="btn btn-success"><i className="fa fa-plus"></i></button></Link>

                            </CardHeader>
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            #
                                        </th>
                                        <th scope="col" className="border-0">
                                            Title
                                        </th>
                                        <th scope="col" className="border-0">
                                            Type
                                        </th>
                                        <th scope="col" className="border-0">
                                            Date
                                        </th>
                                        <th scope="col" className="border-0">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.academicWorks.map((work, i) => {
                                        return (<tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{work.title}</td>
                                            <td>{this.renderTypeText(work.type_id)}</td>
                                            <td>{work.publish_date}</td>
                                            <td>
                                                <Link to={'/admin/academic-work/show/' + work.id } title="documents"><i className="material-icons">visibility</i></Link>
                                                <Link className={this.state.isAdmin ? 'd-none' : ''} to={'/admin/academic-work/edit/' + work.id } title="Edit"><i className="material-icons">edit</i></Link>
                                                <a className={this.state.isAdmin ? 'd-none' : ''} href='#' title="Delete" onClick={this.deleteWork.bind(null,work.id)} ><i className="material-icons">delete</i></a>
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
export default AllAcademicWorks;
