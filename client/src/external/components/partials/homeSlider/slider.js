import React, { Component } from "react";
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';

import 'pure-react-carousel/dist/react-carousel.es.css';
import './slider.css';

class HomeSlider extends Component {
    render() {
        return (
            <div id="rs-slider">
                <div id="home-slider">
                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={50}
                        totalSlides={3}
                        isPlaying={true}
                        interval={3000}
                    >
                        <Slider>
                            <Slide index={0}><div className="item active">
                                <img src="assets/external/images/slider/home3/slide1.jpg" alt="Slide1"/>
                                <div className="slide-content">
                                    <div className="display-table">
                                        <div className="display-table-cell">
                                            <div className="container text-right">
                                                <h1 className="slider-title" data-animation-in="fadeInUp"
                                                    data-animation-out="animate-out">EDUCATION<br/>NEED FOR BETTER LIFE</h1>
                                                <p data-animation-in="fadeInUp" data-animation-out="animate-out"
                                                   className="slider-desc">Fusce sem dolor, interdum in efficitur at, faucibus
                                                    nec lorem.Sed nec molestie justo.<br/> Nunc quis sapien in arcu pharetra
                                                    volutpat.Morbi nec vulputate dolor.</p>
                                                {/*<button className="sl-readmore-btn mr-30" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">READ MORE</button>*/}
                                                {/*<button className="sl-get-started-btn" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">GET STARTED NOW</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div></Slide>
                            <Slide index={1}><div className="item">
                                <img src="assets/external/images/slider/home3/slide2.jpg" alt="Slide2"/>
                                <div className="slide-content">
                                    <div className="display-table">
                                        <div className="display-table-cell">
                                            <div className="container text-right">
                                                <h1 className="slider-title" data-animation-in="fadeInUp"
                                                    data-animation-out="animate-out">ARE YOU READY TO APPLY?</h1>
                                                <p data-animation-in="fadeInUp" data-animation-out="animate-out"
                                                   className="slider-desc">Fusce sem dolor, interdum in efficitur at, faucibus
                                                    nec lorem.Sed nec molestie justo.<br/> Nunc quis sapien in arcu pharetra
                                                    volutpat.Morbi nec vulputate dolor.</p>
                                                {/*<button className="sl-readmore-btn mr-30" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">READ MORE</button>*/}
                                                {/*<button className="sl-get-started-btn" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">GET STARTED NOW</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div></Slide>
                            <Slide index={2}><div className="item">
                                <img src="assets/external/images/slider/home3/slide3.jpg" alt="Slide3"/>
                                <div className="slide-content">
                                    <div className="display-table">
                                        <div className="display-table-cell">
                                            <div className="container text-right">
                                                <h1 className="slider-title" data-animation-in="fadeInUp"
                                                    data-animation-out="animate-out">ARE YOU READY TO APPLY?</h1>
                                                <p data-animation-in="fadeInUp" data-animation-out="animate-out"
                                                   className="slider-desc">Fusce sem dolor, interdum in efficitur at, faucibus
                                                    nec lorem.Sed nec molestie justo.<br/> Nunc quis sapien in arcu pharetra
                                                    volutpat.Morbi nec vulputate dolor.</p>
                                                {/*<button className="sl-readmore-btn mr-30" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">READ MORE</button>*/}
                                                {/*<button className="sl-get-started-btn" data-animation-in="fadeInUp"*/}
                                                   {/*data-animation-out="animate-out">GET STARTED NOW</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div></Slide>
                        </Slider>
                        <DotGroup className="dots-group"/>
                    </CarouselProvider>
                </div>
            </div>
        )
    }
}

export default HomeSlider;
