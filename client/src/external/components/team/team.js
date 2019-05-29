import React, { Component } from "react";
import {ButtonBack, ButtonNext, CarouselProvider, Slide, Slider} from "pure-react-carousel";
import TeamCard from "../partials/teamCard/teamCard";

import 'pure-react-carousel/dist/react-carousel.es.css';
import './team.css';
import Faculties from "../../../contracts/Faculties";

class Team extends Component {
    constructor(props){
        super(props);

        this.state = {
            faculties: []
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
        faculties = faculties.filter((faculty, index) => faculty.id);
        this.setState({faculties: faculties});
    }

    render() {
        return (
            <div id="rs-team" className="rs-team sec-spacer sec-color">
                <div className="container">
                    <div className="abt-title mb-70 text-center">
                        <h2>OUR FACULTIES</h2>
                        <p>Considering desire as primary motivation for the generation of narratives is a useful
                            concept.</p>
                    </div>
                    <div id="rs-slider">
                        <div id="home-slider">
                            <CarouselProvider
                                naturalSlideWidth={25}
                                naturalSlideHeight={28}
                                totalSlides={this.state.faculties.length}
                                visibleSlides={3}
                            >
                                <Slider>
                                    {this.state.faculties.map((faculty, i) => {
                                        return (<Slide  key={i} index={i}><TeamCard faculty={faculty}/></Slide>)
                                    })}
                                </Slider>
                                <ButtonBack><i className="fas fa-angle-left"></i></ButtonBack>
                                <ButtonNext><i className="fas fa-angle-right"></i></ButtonNext>
                            </CarouselProvider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Team;
