import React, { Component } from "react";
import Users from "../../../contracts/Users.json";

class CreateUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 'name' : '',  'eth-address' : '', 'role': 0};

        this.connectToContracts().then(instance => {
            this.state.contract = instance
        });

        this.props.web3.eth.getAccounts().then(accounts => {
            this.state.accounts = accounts;
            this.state.defaulfAccount = accounts[0];
        });

        // This binding is necessary to make `this` work in the callback
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEthAddressChange = this.handleEthAddressChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.createUser = this.createUser.bind(this);
        this.getUserName = this.getUserName.bind(this);
    }

    async connectToContracts(){
        let networkId = await this.props.web3.eth.net.getId();
        const deployedNetwork = Users.networks[networkId];
        const instance = new this.props.web3.eth.Contract(
            Users.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return instance;
    }

    handleNameChange( event) {
        event.preventDefault();
        this.setState({'name': event.target.value});
    }

    handleEthAddressChange( event) {
        event.preventDefault();
        this.setState({'eth-address': event.target.value});
    }

    handleRoleChange( event) {
        event.preventDefault();
        this.setState({'role': event.target.value});
    }

    async createUser(){
        const { contract } = this.state;
        let name = this.props.web3.utils.asciiToHex(this.state.name);
        console.log(this.props.web3.utils.isAddress(this.state.defaulfAccount));
        console.log(this.state['eth-address']);
        await contract.methods.createUser(this.state['eth-address'], name, '11111', this.state.role).send({gas: this.props.web3.utils.toHex(200000), from: this.state.defaulfAccount});
        // await contract.methods.createUser(this.state['eth-address'], name, '11111', this.state.role).send({gas: this.props.web3.utils.toHex(200000), from: this.state.defaulfAccount});
    };

    async getUserName(){
        const { contract } = this.state;
        let key = await contract.methods.getUserName(this.state['eth-address']).call();
        console.log(typeof this.state['eth-address']);
        alert(this.props.web3.utils.toAscii(key));
    }

    render() {
        return (
            <div className="userCreateForm">
                <form>
                    <label>
                        Name:
                        <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange}/>

                        Eth address:
                        <input type="text" name="eth-address" value={this.state['eth-address']} onChange={this.handleEthAddressChange}/>

                        Role:
                        <select name="role" value={this.state.role} onChange={this.handleRoleChange}>
                            <option value="0">Select Role</option>
                            <option value="1">Student</option>
                            <option value="2">Lector</option>
                        </select>
                    </label>
                    <button type="button" onClick={this.createUser}>Create</button>
                    <button type="button" onClick={this.getUserName}>GetKey</button>
                </form>
            </div>
        );
    }
}

export default CreateUserForm;
