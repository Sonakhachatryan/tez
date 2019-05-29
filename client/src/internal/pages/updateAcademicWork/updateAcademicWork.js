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
    ListGroupItem
} from "shards-react";
import Users from "../../../contracts/Users";
import Students from "../../../contracts/Students";
import AcademicWorkForm from "../../components/academicWorkForm/academicWorkForm";
import AcademicWorks from "../../../contracts/AcademicWorks";
import LecturerForm from "../updateLecturer/updateLecturer";

class UpdateAcademicWork extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            work: {
                id: '',
                userAddress: '',
                title: '',
                publish_date: '',
                type: '',
                files: [],
                desc: '',
            },
            contracts: {},
        };

        let workId = props.match.params.id;
        this.getAcademicWork = this.getAcademicWork.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.renderForm = this.renderForm.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getAcademicWork(workId);
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

    }

    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = AcademicWorks.networks[networkId];
        const academicWork = new window.web3Provider.eth.Contract(
            AcademicWorks.abi,
            deployedNetwork && deployedNetwork.address,
        );
        return {
            academicWorksContract: academicWork,
        };
    }

    async getAcademicWork(_id) {
        const academicWorksContract  = this.state.contracts.academicWorksContract;
        let work = await academicWorksContract.methods.getById(_id).call();
        work = JSON.parse(work);
        work.userAddress = work.userAddress.substring(4);
        work.files = work.files ? JSON.parse(decodeURIComponent(work.files)) : {};
        work.desc = decodeURIComponent(work.desc);
        work.type = work.type_id;
        this.setState({work: work});
    }

    renderForm(){
        if(this.state.work.id){
            return(
                <AcademicWorkForm work={this.state.work}/>
            );
        }
    }

    render(){
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Update Academic Work" subtitle="" className="text-sm-left" />
                </Row>
                <Row>
                    <Col>
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Academic Work</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            {this.renderForm()}
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
export default UpdateAcademicWork;
