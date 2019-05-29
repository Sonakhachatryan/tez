import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import withTracker from "./withTracker";
import routes from "./routes";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.0.1.min.css";
import Users from "../contracts/Users";
import { Redirect } from 'react-router-dom';

class AdminApp extends React.Component{
    constructor() {
        super();
        this.state = {
            user: {},
            loading: true,
        };

        this.connectToContracts = this.connectToContracts.bind(this);
    }

    componentDidMount(){
        window.web3Provider.eth.getAccounts().then(res => {
            if (res[0]){
                this.connectToContracts().then(instances => {
                    this.state.contracts = instances;
                    this.getUser(res[0]);
                });

            } else {
                const error = new Error(res.error);
                throw error;
            }
        }).catch(err => {
            console.error(err);
            this.setState({ loading: false, redirect: true });
        });

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
        // todo remove this
        // user.info = "{\"faculty\":\"1\"}";
        user.info = user.info && decodeURIComponent(user.info) ? JSON.parse(decodeURIComponent(user.info)) : {};
        user.publicKey = decodeURIComponent(user.publicKey);
        if(user.id && user.id === _id){
            window.loggedInUser = user;
            this.setState({ loading: false, user: user });
        }else{
            this.setState({ loading: false, redirect: true });
        }
    }

    render(){
        if(this.state.loading){
            return null;
        }

        if (this.state.redirect) {
            return <Redirect to="/"/>;
        }

        return(
            <div className="admin">
                <Router basename={process.env.REACT_APP_BASENAME || ""}>
                    <div>
                        {routes.map((route, index) => {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={withTracker(props => {
                                        let newProps = {};
                                        if(route.props){
                                            newProps = {...props, ... route.props};
                                        }else{
                                            newProps = props;
                                        }
                                        return (
                                            <route.layout {... newProps}>
                                                <route.component {... newProps} />
                                            </route.layout>
                                        );
                                    })}
                                />
                            );
                        })}
                    </div>
                </Router>
            </div>
        )

    }
}
export default AdminApp;
