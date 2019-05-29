import React, { Component } from "react";
import {Link} from "react-router-dom";
import AnimateHeight from 'react-animate-height'
import "./header.css";
import Toolbar from "../toolbar/toolbar";

class Header extends Component {

    constructor(props){
        super(props);
        this.state = {
            active : false ,
            activeMobile: false,
            isMobile: false,
            isScrolled: false,
            height: 'auto'
        };
        //
        // $('.nav-menu > .menu-item-has-children').append(arrow_span);
        // $('.nav-menu > .menu-item-has-children .sub-menu > .menu-item-has-children').append(arrow_span);

        this.menuToggleHandler = this.menuToggleHandler.bind(this);
        this.mobileMenuToggleHandler = this.mobileMenuToggleHandler.bind(this);
    }

    menuToggleHandler(){
        const active = this.state.active;
        this.setState({active: !active});
    }

    mobileMenuToggleHandler(){
        const active = this.state.activeMobile;
        const height = !active ? 200 : 0;
        this.setState({activeMobile: !active, height: height});
    }

    scroll(){
        let scroll = window.scrollY;
        if (scroll < 300) {
            this.setState({isScrolled: false})
        } else {
            this.setState({isScrolled: true})
        }
    }
    /**
     * Calculate & Update state of new dimensions
     */
    updateDimensions() {
        if(window.innerWidth < 992) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }
    }

    /**
     * Add event listener
     */
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        window.addEventListener("scroll", this.scroll.bind(this));
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("scroll", this.scroll.bind(this));
    }

    render() {
        return (
            <div className={ "full-width-header " + (this.state.active ? 'hidden-menu' : '') }>
                <Toolbar/>
                <header id="rs-header" className="rs-header">
                    <div className={"menu-area menu-sticky" + ( this.state.isScrolled ? ' sticky' : '')}>
                        <div className="container">
                            <div className="main-menu">
                                <div className="row rs-vertical-middle">
                                    <div className="col-lg-3 col-md-12">
                                        <div className="logo-area">
                                            <Link to="/"><img src="/assets/external/images/logo-white.png" alt="logo" /></Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-9 col-md-12">
                                        <div className="main-menu">
                                            <a className={"rs-menu-toggle " + ( this.state.activeMobile ? 'rs-menu-toggle-open' : 'rs-menu-toggle-close')} onClick={this.mobileMenuToggleHandler}><i className="fa fa-bars"></i>Menu</a>
                                            <AnimateHeight
                                                duration={ 300 }
                                                height={ !this.state.isMobile ? 'auto' : this.state.height } // see props documentation bellow
                                            >
                                            <nav className={ "rs-menu " + (this.state.activeMobile ? 'op-1' : 'rs-menu-close ') + (this.state.isMobile ? 'rs-menu-mobile' : '') } >
                                                <ul className="nav-menu">
                                                    <li><Link to={'/'}>Home</Link></li>
                                                    <li><Link to={'/faculties'}>Faculties</Link></li>
                                                    <li><Link to={'/about-us'}>About Us</Link></li>
                                                    <li><Link to={'/contact-us'}>Contact</Link></li>
                                                </ul>
                                            </nav>
                                            </AnimateHeight>
                                        </div>
                                        <div className={"toggle-btn text-right " + (this.state.active ? ' active' : '')} onClick={this.menuToggleHandler}>
                                            <span className="border-icon"></span>
                                            <span className="border-icon"></span>
                                            <span className="border-icon"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        )
    }
}

export default Header;
