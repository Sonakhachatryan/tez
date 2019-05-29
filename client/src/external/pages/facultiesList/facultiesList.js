import React, { Component } from "react";
import Banner from "../../components/partials/banner/banner";
import SecondHeader from "../../components/partials/secondHeader/secondHeader";
import Footer from "../../components/partials/footer/footer";
import Faculties from "../../../contracts/Faculties";

import './facultiesList.css';

class FacultiesList extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageName: 'Faculties',
            faculties: [],
            contracts: {}
        }

        this.getFaculties = this.getFaculties.bind(this);
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

    render() {
        return (
            <div className="inner-page">
                <SecondHeader />
                <Banner bannerName={this.state.pageName} />
                <div id="rs-team-2" className="rs-team-2 team-all pt-100 pb-70">
                    <div className="container">
                        <div className="row">
                            {this.state.faculties.map((faculty, index) => {
                                return (
                                    <div key={index} className="col-lg-3 col-md-6 col-xs-6">
                                        <a className='team-wrapper' href={'/faculty/' + faculty.id}>
                                            <div className="team-item">
                                                <div className="team-img">
                                                    <a href="#"><img src={faculty.img} alt=""/></a>
                                                    <div className="social-icon">
                                                        <a className={'m-2'} href={'tel:' + faculty.phone} onClick={(e) => { e.stopPropagation()}}><i className="fa fa-phone"></i></a>
                                                        <a className={'m-2'} href={'mailto:' + faculty.email} onClick={(e) => { e.stopPropagation()}}><i className="fa fa-envelope"></i></a>
                                                    </div>
                                                </div>
                                                <div className="team-body">
                                                    <a href="teachers-single.html"><h3 className="name">{faculty.name}</h3></a>
                                                    <span className="designation">{faculty.shortDesc}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default FacultiesList;
