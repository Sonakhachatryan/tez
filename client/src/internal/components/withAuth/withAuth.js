import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Users from "../../../contracts/Users";

export default function WithAuth(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                user: {},
                isLoggedIn: false,
                loading: true,
                redirect: false,
            };

            this.connectToContracts = this.connectToContracts.bind(this);

        }
        async connectToContracts(){
            let networkId = await window.web3Provider.eth.net.getId();
            let deployedNetwork = Users.networks[networkId];
            const users = new window.web3Provider.eth.Contract(
                Users.abi,
                deployedNetwork && deployedNetwork.address,
            );

            return {
                usersContract: users,
            };
        }

        async getUser(_id) {
            const contract  = this.state.contracts.usersContract;
            let user = await contract.methods.getById(_id).call();
            user = JSON.parse(user);
            user.id = user.id.substring(4);
            let encoded = user.info;
            encoded = encoded.replace(/\\'/g, '')
                .replace(/([\{|:|,])(?:[\s]*)(')/g, "$1\"")
                .replace(/(?:[\s]*)(?:')([\}|,|:])/g, "\"$1")
                .replace(/([^\{|:|,])(?:')([^\}|,|:])/g, "$1\\'$2");
            user.info = user.info ? JSON.parse(encoded) : {};
            user.publicKey = decodeURIComponent(user.publicKey);
            this.setState({user: user});
        }

        componentDidMount(){
            window.web3Provider.eth.getAccounts().then(res => {
                if (res[0] && res[0] == window.loggedInUser.id){
                } else {
                    this.setState({ loading: false, redirect: true });
                }
                }).catch(err => {
                    console.error(err);
                    this.setState({ loading: false, redirect: true });
                });

        }

        render() {
            const { loading, redirect, user, isLoggedIn } = this.state;
            if (loading) {
                return null;
            }

            if (redirect) {
                return <Redirect to="/" />;
            }

            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );

        }
    }
}