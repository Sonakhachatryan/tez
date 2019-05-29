import React, { Component } from "react";
import {Link} from "react-router-dom";

class Banner extends Component {

    constructor(props){
        super(props);
        this.state = {
            bannerName : this.props.bannerName ,
        };
    }

    render() {
        return (
            <div className="rs-breadcrumbs bg7 breadcrumbs-overlay">
                <div className="breadcrumbs-inner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1 className="page-title">{this.props.bannerName.toLocaleUpperCase()}</h1>
                                <ul>
                                    <li>
                                        <Link to="/" className="active">Home</Link>
                                    </li>
                                    <li>{this.props.bannerName}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Banner;
