import React, { Component } from "react";

class HistoryCard extends Component {

    constructor(props){
        super(props)

        this.state = {
            title: this.props.title,
            body: this.props.body,
            image: this.props.image,
            classList: 'sec-spacer'
        };
        this.state.classList += this.props.bgColor === "second" ? ' sec-color' : '';
        this.state.classList += this.props.imagePos === "left" ? ' rs-history' : '';
        this.renderContent = this.renderContent.bind(this);
    }

    renderContent(){
        if(this.props.imagePos === "left"){
            return(
                <div className="row">
                    <div className="col-lg-6 col-md-12 rs-vertical-bottom mobile-mb-50">
                        <span>
                            <img src={this.state.image} alt={this.state.title}/>
                        </span>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="abt-title">
                            <h2>{this.state.title.toLocaleUpperCase()}</h2>
                        </div>
                        <div className="about-desc" dangerouslySetInnerHTML={{__html: this.state.body}}></div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="abt-title">
                            <h2>{this.state.title.toLocaleUpperCase()}</h2>
                        </div>
                        <div className="about-desc" dangerouslySetInnerHTML={{__html: this.state.body}}></div>
                    </div>
                    <div className="col-lg-6 col-md-12 rs-vertical-bottom mobile-mb-50">
                        <span>
                            <img src={this.state.image} alt={this.state.title}/>
                        </span>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className={this.state.classList}>
                <div className="container">
                    { this.renderContent() }
                </div>
            </div>
        );
    }
}

export default HistoryCard;
