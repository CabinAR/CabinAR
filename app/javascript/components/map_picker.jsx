
import React from 'react'


class MapPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      radius: props.radius || 20,
      latitude: props.latitude,
      longitude: props.longitude
    }


    this.mapRef = React.createRef()
  }

  componentDidMount() {
    window.mapboxgl.accessToken = this.props.accessToken;
    this.map = new window.mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center(),
      zoom: 16 // starting zoom
    });


    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false
    })

    this.map.addControl(this.geocoder);

    this.geocoder.on("result",this.selectResult)

    this.map.on("click",this.moveCircle)

    this.map.on('render', () => {
      this.map.resize();
      this.renderCircle();
    })

  }

  center() {
    if(this.state.latitude) {
      return [ this.state.longitude, this.state.latitude ]
    } else {
      return [-74.50, 40]// starting positionp]
    }
  }


  componentDidUpdate() {
    this.renderCircle()
  }

  renderCircle = () => {
    if(this.state.longitude) {
      this.setCircle([this.state.longitude, this.state.latitude],this.state.radius)
    }
  }

  moveCircle = (loc) => {
    this.setState({
      latitude: loc.lngLat.lat,
      longitude: loc.lngLat.lng
    })
  }

  selectResult = (result) => {
    this.setState({
      latitude: result.result.center[1],
      longitude: result.result.center[0]
    })
  }

  setCircle(center, radiusInM) {
    var geoJSON = this.createGeoJSONCircle(center, radiusInM / 1000)

    if(this.source) {
      this.map.getSource('polygon').setData(geoJSON.data);
    } else {
      this.source = this.map.addSource("polygon", geoJSON)

      this.map.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
          "fill-color": "blue",
          "fill-opacity": 0.6
        }
      });
    }
  }

  setRadius = (e) => {
    this.setState({
      radius: e.currentTarget.value
    })
  }

  createGeoJSONCircle(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
  }


  render() {
    return <div className='space-form__wrapper'>
     <input type='range' name="space[radius]" min="10" max="200"  value={this.state.radius} onChange={this.setRadius} />
     <input type='hidden' name='space[latitude]' value={this.state.latitude || ""} />
     <input type='hidden' name='space[longitude]' value={this.state.longitude || ""} />
     <div className='space-form__map' ref={this.mapRef}>
    </div>
    </div>
  }

}


export default MapPicker;