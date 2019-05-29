import React, {Component} from "react";
import ContactCard from "../partials/contactCard/contactCard";
import InfoContract from "../../../contracts/Info";

class ContactCardsList extends Component{
    constructor(props){
        super(props);

        this.state = {
            cardItems: JSON.parse(this.props.cardItems),
        }

        console.log(this.state);
    }

    render(){
        return(
            <div className="row contact-address-section">
                {JSON.parse(this.props.cardItems).map(function(item, index){
                    return <ContactCard
                        key={index}
                        cardName={item.cardName}
                        iconName={item.iconName}
                        classString={item.classString}
                        items={item.items}
                    />
                })}
            </div>
        )
    }
}

export default ContactCardsList