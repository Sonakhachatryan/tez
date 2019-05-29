import React, {Component} from "react";

import "./contactForm.css"

class ContactForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            fname: '',
            lname: '',
            email: '',
            subject: '',
            content: '',
            formErrors: {fname:'', lname: '', email: '', subject: '', content: ''},
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateField = this.validateField.bind(this);
        this.send = this.send.bind(this);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log(value);
        this.setState({[name]: value});
        this.validateField(name,value);
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let errorsCount = 0;
        switch(fieldName) {
            case 'email':
                let emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
                if(!emailValid) {
                    errorsCount++ ;
                }
                break;
            case 'fname':
            case 'lname':
            case 'subject':
            case 'content':
                let fieldIsValid = value.length !== 0;
                fieldValidationErrors[fieldName] = fieldIsValid ? '': 'Field is required';
                if(!fieldIsValid) {
                    errorsCount++ ;
                }
                break;
            default:
                break;
        }

        this.setState({formErrors: fieldValidationErrors,
            isFormValid: !!errorsCount
        });
    }

    send(){
        let emailObj = {
            name: this.state.name,
            lname: this.state.lname,
            email: this.state.email,
            subject: this.state.subject,
            content: this.state.content,
        }
    }

    render() {
        return (
            <form id="contact-form">
                <fieldset>
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>First Name*</label>
                                <input name="fname" id="fname" className="form-control" type="text" value={this.state.fname} onChange={this.handleUserInput}/>
                                <span className="text-danger">{this.state.formErrors.fname}</span>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>Last Name*</label>
                                <input name="lname" id="lname" className="form-control" type="text" value={this.state.lname} onChange={this.handleUserInput}/>
                                <span className="text-danger">{this.state.formErrors.lname}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>Email*</label>
                                <input name="email" id="email" className="form-control" type="email" value={this.state.email} onChange={this.handleUserInput}/>
                                <span className="text-danger">{this.state.formErrors.email}</span>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>Subject *</label>
                                <input name="subject" id="subject" className="form-control" type="text" value={this.state.subject} onChange={this.handleUserInput}/>
                                <span className="text-danger">{this.state.formErrors.subject}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea cols="40" rows="10" id="message" name="message"
                                          className="textarea form-control" onChange={this.handleUserInput} value={this.state.content}></textarea>
                                <span className="text-danger">{this.state.formErrors.content}</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-0">
                        <button className="btn-send" disabled={ this.state.isFormValid ? '' : 'disabled'} onClick={this.send()}>Submit Now</button>
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default ContactForm;