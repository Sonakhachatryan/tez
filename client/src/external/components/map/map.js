import React, { Component } from "react";
import MapGL, {Marker, FullscreenControl,NavigationControl} from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./map.css";

class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            accessToken: "pk.eyJ1Ijoic29uYTE5OTUiLCJhIjoiY2p1d3ZqbWx1MDEydjQ0bXFsam5rMmplYyJ9.kZum5MURMXrxEwIFIo5BMQ",
            viewport: {
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                zoom: 14
            }
        };
    }
    render() {
        return (
            <MapGL
                style={{ width: '100%', height: '400px' }}
                mapStyle='mapbox://styles/mapbox/light-v9'
                accessToken={this.state.accessToken}
                latitude={this.props.latitude}
                longitude={this.props.longitude}
                zoom={this.state.viewport.zoom}
                onViewportChange={viewport => this.setState({ viewport })}
            >
                <Marker
                    longitude={this.state.viewport.longitude}
                    latitude={this.state.viewport.latitude}
                ><span className={"marker"}><i className="fa fa-map-marker"></i></span>
                </Marker>
                <FullscreenControl position='top-right' />
                <NavigationControl showCompass showZoom position='bottom-right' />
            </MapGL>
        );
    }
}

export default Map;
