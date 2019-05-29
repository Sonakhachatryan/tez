import React, { Component } from "react";
// import CreateUserForm from "./external/components/createUserForm/createUser.js";
import getWeb3 from "./utils/getWeb3";
import Loader from "./external/components/loader.js";

import "./App.css";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./external/pages/home/home";
import About from "./external/pages/about/about";
import Contact from "./external/pages/contact/contact";
import AdminApp from "./internal/App";
import CreateUserForm from "./external/components/createUserForm/createUser";
import Faculty from "./external/pages/faculty/faculty";
import FacultiesList from "./external/pages/facultiesList/facultiesList";


class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();
      //
      // // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      window.web3 = web3;
      this.setState({ web3 }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    //
    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    //
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    //
    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div><Loader/></div>;
    }
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/faculties" component={FacultiesList}/>
            <Route exact path="/about-us" component={About}/>
            <Route exact path="/contact-us" component={Contact}/>
            <Route path="/faculty/:id" component={Faculty}/>
            <Route path="/admin" component={AdminApp}/>
          </Switch>
          {/*<CreateUserForm web3={this.state.web3}/>*/}
        </div>
      </Router>
    );
  }
}

export default App;
