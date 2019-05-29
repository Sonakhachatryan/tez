import React, { Component } from "react";
import Header from "../../components/partials/header/header";
import HomeSlider from "../../components/partials/homeSlider/slider";
import Welcome from "../../components/homeWelcome/homeWelcome";
import Footer from "../../components/partials/footer/footer";

class Home extends Component {
    render() {
        return (
            <div className="home3">
                <Header />
                <HomeSlider />
                <Welcome />
                <Footer />
            </div>
        );
    }
}

export default Home;
