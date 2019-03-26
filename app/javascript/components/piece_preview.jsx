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
    if(this.props.marker_url) {
      return <a-plane id="marker-box" src={this.props.marker_url}  position="0 0 0" rotation="-90 0 0" width="4" height="4" />
    } else {
       return <a-plane id="marker-box"  position="0 0 0" rotation="-90 0 0" width="4" height="4" />
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
    return <div className='preview'>
    <div className='preview__actions'>
      <button className='preview__action' onClick={this.savePiece}>Save</button>
      <button className='preview__action' onClick={this.deletePiece}>Delete</button>
    </div>
    <div className='preview__wrapper'>
      <a-scene background="color: #ECECEC" embedded vr-mode-ui="enabled: false">
       <a-camera id="orbitCamera"
          look-controls="enabled: false; touchEnabled: false;"
          wasd-controls-enabled="false"
          orbit-controls='target: 0 0 0; 
            minDistance: 0.5; 
            maxDistance: 10; 
            maxPolarAngle: 89;
            initialPosition: 0 5 5;' 
          />
      <a-assets>
      </a-assets>
      {this.renderMarkerImage()}
      <a-entity ref={this.previewRef}>
       </a-entity>
      </a-scene>
    </div>
    </div>
  }

}

export default PiecePreview;