import React, { Component } from "react";
import InfoContract from "../../../../contracts/Info";
import {Link} from "react-router-dom";

import './footer.css';
class Footer extends Component {

    constructor(props){
        super(props);

        this.state = {
            adresses: '',
            emails: [],
            phones: [],
            socialLinks: {
                facebook: '#',
                twitter: '#',
                linkedin: '#',
            }
        };

        this.getData = this.getData.bind(this);
        this.renderPhone = this.renderPhone.bind(this);
        this.renderEmail = this.renderEmail.bind(this);
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

    renderPhone(phone, index){
        return (<span key={index}><a className='text-white' href={'tel:' + phone}>{phone}</a><br/></span>);
    }

    renderEmail(email, index){
        return (<span key={index}><a className='text-white' href={'mailto:' + email}>{email}</a><br/></span>);
    }

    render() {
        return (
            <footer id="rs-footer" className="bg3 rs-footer">
                <div className="container">
                    <div>
                        <div className="row footer-contact-desc">
                            <div className="col-md-4">
                                <div className="contact-inner">
                                    <i className="fa fa-map-marker"></i>
                                    <h4 className="contact-title">Address</h4>
                                    <p className="contact-desc">
                                        {this.state.addresses}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="contact-inner">
                                    <i className="fa fa-phone"></i>
                                    <h4 className="contact-title">Phone Number</h4>
                                    <p className="contact-desc">
                                        {this.state.phones.map((phone, index) => {
                                            return this.renderPhone(phone, index);
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="contact-inner">
                                    <i className="fa fa-map-marker"></i>
                                    <h4 className="contact-title">Email Address</h4>
                                    <p className="contact-desc">
                                        {this.state.emails.map((email, index) => {
                                            return this.renderEmail(email, index);
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="about-widget">
                                    <img src="/assets/external/images/logo-footer.png" alt="Footer Logo"/>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, eaque minus mollitia nesciunt praesentium quam quasi quidem rem temporibus vitae?</p>
                                        <p className="margin-remove">Education need for better life.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <h5 className="footer-title">OUR SITEMAP</h5>
                                <ul className="sitemap-widget">
                                    <li>
                                        <Link to="/"><i className="fa fa-angle-right" aria-hidden="true"/>Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/faculties"><i className="fa fa-angle-right" aria-hidden="true"/>Faculties</Link>
                                    </li>
                                    <li>
                                        <Link to="/about-us"><i className="fa fa-angle-right" aria-hidden="true"/>About Us</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact-us"><i className="fa fa-angle-right" aria-hidden="true"/>Contact</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <h3 className="footer-title">SOCIAL FEED</h3>
                                <ul className="flickr-feed">
                                    <ul>
                                        <li>
                                            <Link to={this.state.socialLinks.facebook}><i className="fab fa-facebook" aria-hidden="true"></i><span>Facebook</span></Link>
                                        </li>
                                        <li>
                                            <Link to={this.state.socialLinks.twitter}><i className="fab fa-twitter"></i><span>Twitter</span></Link>
                                        </li>
                                        <li>
                                            <Link to={this.state.socialLinks.linkedin}><i className="fab fa-linkedin"></i><span>Linked In</span></Link>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="copyright">
                            <p>© 2018 <a href="#">RS Theme</a>. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
