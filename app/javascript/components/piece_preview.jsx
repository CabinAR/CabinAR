import React from 'react'

import { debounce } from "lodash"

import {Entity, Scene} from 'aframe-react';

class PiecePreview extends React.Component {

  constructor(props) {
    super(props)
    this.previewRef = React.createRef()
  }

  componentDidMount() {
    this.refresh()
  }

  refreshNow= () => {
    this.previewRef.current.innerHTML = this.props.code
  }

  refresh = debounce(() => { this.refreshNow() }, 500)

  shouldComponentUpdate(nextProps, nextState) {
    return true 
    //(nextProps.pieceId != this.props.pieceId) ||
    //       (nextProps.code != this.props.code)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.pieceId != this.props.pieceId) {
      this.refreshNow()
    } else if(prevProps.code != this.props.code) {
      this.refresh()
    }
  }

  renderMarkerImage() {
    const { marker_meter_width, marker_meter_height } = this.props;

    if(this.props.marker_url) {
      return <Entity geometry={{primitive: 'plane', width:  marker_meter_width, height: marker_meter_height }}  
      id="marker-box" 
      material={{ src: this.props.marker_url}}  shadow position="0 0 0" rotation="-90 0 0" />
    } else {
       return <Entity geometry={{primitive: 'plane'}}  id="marker-box" shadow position="0 0 0" rotation="-90 0 0"  />
    }
  }

  savePiece = () => {
    this.props.savePiece(this.props.pieceId);
  }

  deletePiece = () => {
    if(confirm("Are you sure you want to delete this piece?")) {
      this.props.deletePiece(this.props.pieceId);
    }
  }

  render() {
    const { marker_meter_width } = this.props;
    return <div className='preview'>
    <div className='preview__actions'>
      <button className='preview__action' onClick={this.deletePiece}>Delete</button>
      <button className='preview__action' onClick={this.savePiece}>Save</button>
    </div>
    <div className='preview__wrapper'>
      <a-scene background="color: #ECECEC" embedded vr-mode-ui="enabled: false">
       <a-camera id="orbitCamera"
          look-controls="enabled: false; touchEnabled: false;"
          wasd-controls-enabled="false"
          orbit-controls='target: 0 0 0; 
            minDistance: 0.5; 
            maxDistance: 100; 
            maxPolarAngle: 89;
            initialPosition: 0 5 5;' 
          />
      <a-assets>
      </a-assets>
      {this.renderMarkerImage()}
      <a-entity ref={this.previewRef} scale={`${marker_meter_width} ${marker_meter_width} ${marker_meter_width}`}>
       </a-entity>
      </a-scene>
    </div>
    </div>
  }

}

export default PiecePreview;