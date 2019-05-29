import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Users from "../../../contracts/Users";
import RoleText from "../../components/common/RoleText";

class AllUsers extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
        }

        this.getUsers = this.getUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getUsers();
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

        return {
            usersContract: users
        };
    }

    async getUsers() {
        const contract  = this.state.contracts.usersContract;
        let users = await contract.methods.getAll(0, 0).call();
        // let users = await contract.methods.getKeys().call();
        users = JSON.parse(users);
        users.map((item, index) =>  {
            users[index].id = item.id.substring(4);
            users[index].publicKey = decodeURIComponent(item.publicKey);
        });

        switch (window.loggedInUser.role) {
            case "100":
                users = users.filter(user => ["1", "2"].indexOf(user.role) != -1);
                break;
        }

        this.setState({users: users});
    }

    async deleteUser(userId) {
        const contract = this.state.contracts.usersContract;
        await contract.methods.deleteUser(userId).send({gas: window.web3Provider.utils.toHex(6654755), from: this.state.defaulfAccount});
        this.getUsers();
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="All Usres" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0 mr-2 d-inline-block">Add User</h6>
                                <Link to={"/admin/user/add"}><button className="btn btn-success"><i className="fa fa-plus"></i></button></Link>

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
                                            Role
                                        </th>
                                        <th scope="col" className="border-0">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.users.map((user, i) => {
                                        return (<tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td><RoleText role={user.role}/></td>
                                            <td>
                                                <Link to={'/admin/user/edit/' + user.id } title="Edit"><i className="material-icons">edit</i></Link>
                                                <Link to={'/admin/user/documents/' + user.id } title="documents"><i className="material-icons">vertical_split</i></Link>
                                                <a href='#' title="Delete" onClick={() => this.deleteUser(user.id)} ><i className="material-icons">delete</i></a>
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
export default AllUsers;
