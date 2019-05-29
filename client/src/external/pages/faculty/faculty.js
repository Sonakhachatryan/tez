import React, { Component } from "react";
import Banner from "../../components/partials/banner/banner";
import SecondHeader from "../../components/partials/secondHeader/secondHeader";
import Footer from "../../components/partials/footer/footer";
import Faculties from "../../../contracts/Faculties";
import ChairsABI from "../../../contracts/Chairs";

class Faculty extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageName: 'Faculty',
            faculty: {
                id: '',
                name: '',
                shortDesc: '',
                img: '',
                phone: '',
                email: '',
                info: '',
            },
            chairs: [],
            contracts: {}
        }

        let facultyId = props.match.params.id;
        this.getFaculty = this.getFaculty.bind(this);
        this.getChairs = this.getChairs.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getChairs(facultyId);
            this.getFaculty(facultyId);
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
        deployedNetwork = ChairsABI.networks[networkId];
        const chairs = new window.web3Provider.eth.Contract(
            ChairsABI.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            facultiesContract: faculties,
            chairsContract: chairs
        };
    }

    async getFaculty(_id) {
        const contract  = this.state.contracts.facultiesContract;
        let faculty = await contract.methods.getById(_id).call();
        faculty = JSON.parse(faculty);
        faculty.info = decodeURIComponent(faculty.info);
        this.setState({pageName: faculty.name, faculty: faculty});
    }

    async getChairs(facultyId){
        const contract  = this.state.contracts.chairsContract;
        console.log(contract);
        let chairs = await contract.methods.getFacultyChairs(facultyId).call();
        console.log(chairs);
        if(chairs){
            chairs = JSON.parse(JSON.parse(chairs));
            this.setState({chairs: chairs});
        }
    }

    render() {
        return (
            <div className="inner-page">
                <SecondHeader />
                <Banner bannerName={this.state.pageName} />
                <div className="single-blog-details sec-spacer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="single-image">
                                    <img className={'w-100'} src={this.state.faculty.img} alt="single"/>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: this.state.faculty.info}}></div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="sidebar-area">
                                    <div className="cate-box">
                                        <h3 className="title">Chairs</h3>
                                        <ul>
                                            {this.state.chairs.map((value, index) => {
                                                return (<li key={index}>
                                                          <i className="fa fa-angle-right" aria-hidden="true"></i> {value.name}
                                                        </li>);
                                            })}
                                        </ul>
                                    </div>
                                    <div className="newsletter">
                                        <h4>Contact info</h4>
                                        <div className="box-newsletter mt-2">
                                            <a href={'tel:' + this.state.faculty.phone}>{this.state.faculty.phone}</a>
                                            <br/>
                                            <a href={'mailto:' + this.state.faculty.email}>{this.state.faculty.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Faculty;
