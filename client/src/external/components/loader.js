import React, { Component } from "react";

class Loader extends Component {
    render() {
        return (
            <div className="book_preload">
                <div className="book">
                    <div className="book__page"></div>
                    <div className="book__page"></div>
                    <div className="book__page"></div>
                </div>
            </div>
        )
    }
}

export default Loader;
