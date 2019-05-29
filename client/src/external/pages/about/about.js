import React, { Component } from "react";
import Banner from "../../components/partials/banner/banner";
import SecondHeader from "../../components/partials/secondHeader/secondHeader";
import HistoryCard from "../../components/partials/historyCard/historyCard";
import Team from "../../components/team/team";
import Footer from "../../components/partials/footer/footer";
import InfoContract from "../../../contracts/Info";

class About extends Component {
    constructor(props){
        super(props)

        this.state = {
            pageName: 'About Us',
            sections:[
                // {
                //     title: '',
                //     body: '',
                //     image: ''
                // }
            ]
        };

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

        let obj = {
            addresses: data.addresses
        };

        if(data.sections.length){
            obj.sections = data.sections;
        }

        this.setState(obj);
    }

    render() {
        return (
            <div className="inner-page">
                <SecondHeader />
                <Banner bannerName={this.state.pageName}/>
                {this.state.sections.map(function(item, index){
                     return <HistoryCard key={index} title={item.title} body={item.body} image={item.image} imagePos={(index % 2 ? 'right' : 'left')} bgColor={(index % 2 ? 'second' : '')}/>
                })}

                <div id="rs-calltoaction" className="rs-calltoaction sec-spacer bg4">
                    <div className="container">
                        <div className="rs-cta-inner text-center">
                            <div className="sec-title mb-50 text-center">
                                <h2 className="white-color">Lorem ipsum dolor sit amet consectetur </h2>
                                <p className="white-color">Fusce sem dolor, interdum in efficitur at, faucibus nec
                                    lorem.</p>
                            </div>
                            <p className="white-color">Lorem ipsum</p>
                        </div>
                    </div>
                </div>

                <Team />
                <Footer/>
            </div>
        );
    }
}

export default About;
