import React, { Component } from "react";
import {Link} from "react-router-dom";
import InfoContract from "../../../../contracts/Info";

class Toolbar extends Component {

    constructor(props){
        super(props);

        this.state = {
            adresses: '',
            emails: [''],
            phones: [''],
            socialLinks: {
                facebook: '#',
                twitter: '#',
                linkedin: '#',
            }
        };

        this.getData = this.getData.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);
        this.renderLeftText = this.renderLeftText.bind(this);

        this.connectToContracts().then(instances => {
            this.state.contracts = instances;
            this.getData();
        });

        window.web3Provider.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });
    }


    async connectToContracts(){
        let networkId = await window.web3Provider.eth.net.getId();
        let deployedNetwork = InfoContract.networks[networkId];
        const info = new window.web3Provider.eth.Contract(
            InfoContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            infoContract: info,
        };
    }

    async getData() {
        const contract  = this.state.contracts.infoContract;
        let data = await contract.methods.getData().call();
        data = JSON.parse(data);

        let obj = {
            addresses: data.addresses
        };

        if(data.emails.length){
            obj.emails = data.emails;
        }

        if(data.phones.length){
            obj.phones = data.phones;
        }

        if(typeof data.socialLinks === 'object'){
            obj.socialLinks = data.socialLinks;
        }
        this.setState(obj);
    }

    renderLeftText(){
        if(!this.props.inner){
            return (
                <div className="rs-toolbar-left">
                    <div className="welcome-message">
                        <i className="glyph-icon flaticon-placeholder"></i>
                        <span>{this.state.addresses}</span>
                    </div>
                    <div className="welcome-message">
                        <i className="glyph-icon flaticon-phone-call"></i>
                        <span>
                            <Link to={"tel:" + this.state.phones[0]}>{this.state.phones[0]}</Link>
                        </span>
                    </div>
                    <div className="welcome-message">
                        <i className="glyph-icon flaticon-email"></i>
                        <span>
                            <Link to={"mailto:" + this.state.emails[0]}>{this.state.emails[0]}</Link>
                        </span>
                    </div>
                </div>
            )
        }else{
            return (
                <div className="rs-toolbar-left">
                    <div className="welcome-message">
                        <i className="fa fa-bank"></i><span>Welcome to Edulearn</span>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="rs-toolbar col-xs-0 d-none d-lg-block">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mt-3 col-md-12">
                            {this.renderLeftText()}
                        </div>
                        <div className="col-lg-6 mt-3 col-md-12">
                            <div className="rs-toolbar-right">
                                <div className="toolbar-share-icon">
                                    <ul>
                                        <li>
                                            <a href={this.state.socialLinks.facebook} target="_blank"><i className="fab fa-facebook" aria-hidden="true"></i></a>
                                        </li>
                                        <li>
                                            <a href={this.state.socialLinks.twitter} target="_blank"><i className="fab fa-twitter"></i></a>
                                        </li>
                                        <li>
                                            <a href={this.state.socialLinks.linkedin} target="_blank"><i className="fab fa-linkedin"></i></a>
                                        </li>
                                    </ul>
                                </div>
                                <a className="link-red" href={"/admin"}>My Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default Toolbar;
