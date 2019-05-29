import React, { Component } from "react";
import InfoContract from "../../../contracts/Info";

import './homeWelcome.css';
class Welcome extends Component {
    constructor(props){
        super(props);
        this.state = {
            sections: []
        }

        this.getData = this.getData.bind(this);
        this.connectToContracts = this.connectToContracts.bind(this);

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

        let obj = {};

        if(data.sections.length){
            obj.sections = data.sections;
        }

        this.setState(obj);
    }

    renderSection(section, index){
        let collapsed = !!index;

        return(
            <div key={index} className="card">
                <div className="card-header" id={"heading" + index}>
                    <h3 className={"acdn-title  " + (collapsed ? ' collapsed': '')} data-toggle="collapse" data-target={ "#collapse" + index }
                        aria-expanded={collapsed} aria-controls={ "collapse" + index }>
                        {section.title}
                    </h3>
                </div>
                <div id={ "collapse" + index } className={"collapse " + (collapsed ? '' : 'show')} aria-labelledby={"heading" + index}
                     data-parent="#accordion">
                    <div className="card-body" dangerouslySetInnerHTML={{__html: section.body}}>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div id="rs-about" className="rs-about sec-spacer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="about-img rs-animation-hover">
                                <img src={this.state.sections.length && this.state.sections[0].image} alt="img02"/>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="about-desc">
                                <h2>WELCOME TO EDULEARN</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua</p>
                            </div>
                            <div id="accordion" className="rs-accordion-style1">
                                {this.state.sections.map((section, index) => {
                                    return this.renderSection(section, index);
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;
