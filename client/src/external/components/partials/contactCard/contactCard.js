import React, {Component} from "react";

class ContactCard extends Component{
    constructor(props){
        super(props);

        this.state = {
            classString: this.props.classString,
            iconName: this.props.iconName,
            cardName: this.props.cardName,
            items: this.props.items
        };

        console.log(this.state);
        this.generateLine = this.generateLine.bind(this)
    }

    generateLine(line, index){
       switch (line.type) {
           case "text":
               return(<p key={index}>{line.value}</p>);
           case "phone":
               return(<a key={index} href={"tel:" + line.value}>{line.value}</a>);
           case "email":
               return(<a key={index} href={"mailto:" + line.value}>{line.value}</a>);
           default:
               return(<p key={index}>{line.value}</p>);

       }
    }
    render(){
        return(
            <div className={"col-md-4 " + this.state.classString}>
                <div className="contact-info contact-address">
                    <i className={this.state.iconName}></i>
                    <h4>{this.state.cardName}</h4>
                    {this.state.items.map((item, index) => {
                        return this.generateLine(item, index)
                    })}
                </div>
            </div>
        )
    }
}

export default ContactCard