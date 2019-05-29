import React, { Component } from "react";
import Banner from "../../components/partials/banner/banner";
import SecondHeader from "../../components/partials/secondHeader/secondHeader";
import Footer from "../../components/partials/footer/footer";
import Map from "../../components/map/map";
import ContactCardsList from "../../components/contactCardsList/contactCardsList";
import ContactForm from "../../components/contactForm/contactForm";

import './contact.css';
import InfoContract from "../../../contracts/Info";

class Contact extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageName: 'Contact',
            cardItems: [],
            locationCoordinates: {
                latitude: 0,
                longitude: 0,
            }
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
        obj.cardItems = [];

        obj.cardItems.push({
            classString: 'pl-0',
            iconName: 'fa fa-map-marker',
            cardName: 'ADDRESS',
            items: [{
                type: "text",
                value: data.addresses,
            }]
        });

        if(data.phones.length){
            let phones = [];
            for(let i = 0; i < data.phones.length; i++){
                phones.push({
                    type: "phone",
                    value: data.phones[i],
                })
            }
            obj.cardItems.push({
                classString: 'pl-0',
                iconName: 'fa fa-phone',
                cardName: 'PHONE NUMBER',
                items: phones
            });
        }

        if(data.emails.length){
            let emails = [];
            for(let i = 0; i < data.emails.length; i++){
                emails.push({
                    type: "email",
                    value: data.emails[i],
                })
            }
            obj.cardItems.push({
                classString: 'pl-0',
                iconName: 'fa fa-envelope',
                cardName: 'EMAIL ADDRESS',
                items: emails
            });
        }

        if(typeof data.locationCoordinates === 'object'){
            obj.locationCoordinates = data.locationCoordinates;
        }
        console.log(obj);
        this.setState(obj);
    }

    render() {
        return (
            <div className="inner-page">
                <SecondHeader />
                <Banner bannerName={this.state.pageName} />
                <div className="contact-page-section sec-spacer">
                    <div className="container">
                        <Map latitude={this.state.locationCoordinates.latitude} longitude={this.state.locationCoordinates.longitude}/>
                        <ContactCardsList cardItems={JSON.stringify(this.state.cardItems)}/>

                        <div className="contact-comment-section">
                            <h3>Contact us</h3>
                            <div id="form-messages"></div>
                            <ContactForm/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Contact;
