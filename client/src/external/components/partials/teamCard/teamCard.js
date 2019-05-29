import React, { Component } from "react";

import './teamCard.css';

class TeamCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            faculty: this.props.faculty
        };

        this.redirectTo = this.redirectTo.bind(this);
    }

    redirectTo(facultyId){

    }

    render() {
        return (
            <div className="team-item">
                <a  href={'/faculty/' + this.state.faculty.id}>
                    <div className="team-img">
                        <img src={this.state.faculty.img} alt="team" />
                        <div className="normal-text">
                            <h3 className="team-name">{this.state.faculty.name}</h3>
                            {/*<span className="subtitle">Vice Chancellor</span>*/}
                        </div>
                    </div>
                    <div className="team-content">
                        <div className="overly-border"></div>
                        <div className="display-table">
                            <div className="display-table-cell">
                                <h3 className="team-name"><a href="teachers-single.htmll">{this.state.faculty.name}</a></h3>
                                <span className="red-line"></span>
                                <p className="team-desc">{this.state.faculty.shortDesc}</p>
                                <div className="team-social">
                                    <a href={"tel:" + this.state.faculty.phone} className="social-icon" onClick={(e) => {e.stopPropagation()}}><i className="fa fa-phone"></i></a>
                                    <a href={"mailto:" + this.state.faculty.email} className="social-icon" onClick={(e) => {e.stopPropagation()}}><i className="fa fa-envelope"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}

export default TeamCard;
