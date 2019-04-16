import React from 'react'

import { debounce } from "lodash"

import {Entity, Scene} from 'aframe-react';


import Inspector from "../inspector"

import Events from '../lib/Events';

import { getEntityInnerRepresentation } from "../lib/entity"

import xmlChecker from 'xmlchecker'

class PiecePreview extends React.Component {

  constructor(props) {
    super(props)

    // Keep editor state in here
    this.state = {
      tool: 'translate',
      inspector: true
    }

    this.previewRef = React.createRef()
  }

  componentDidMount() {
    this.refreshNow();
    AFRAME.INSPECTOR = this.inspector = new Inspector()

    Events.emit('transformmodechange',this.props.gizmo)
    Events.on("updatedScene",this.outputScene)
    Events.on('objectremove', this.removeObject);
  }

  removeObject = (e) => {
    this.outputScene()
  }


  outputScene = () => {
    this.props.updatePiece(this.props.pieceId, { code: getEntityInnerRepresentation(this.previewRef.current), refresh: false } ) 
  }

  refreshNow= () => {
    if(this.inspector) { this.inspector.deselect() }

    try { 
      if(xmlChecker.check('<?xml version="1.0" encoding="UTF-8"?><scene>'
 + this.props.code + '</scene>')) {
        this.previewRef.current.innerHTML = this.props.code
      }
    } catch(err) { 
      console.log(err)
      //note invalid XML
    }
  }

  refresh = debounce(() => { this.refreshNow() }, 500)

  shouldComponentUpdate(nextProps, nextState) {
    return true 
    //(nextProps.pieceId != this.props.pieceId) ||
    //       (nextProps.code != this.props.code)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.pieceId != this.props.pieceId) {
      // deselect selected piece
      this.refreshNow()
    } else if(prevProps.code != this.props.code) {
      if(this.props.refresh) {
        this.refresh()
      }
    }
  }

  renderMarkerImage() {
    const { marker_meter_width, marker_meter_height } = this.props;

    if(this.props.marker_url) {
      return <Entity geometry={{primitive: 'plane', width:  marker_meter_width, height: marker_meter_height }}  
      key={`marker-${this.props.pieceId}`}
      id="marker-box"  data-aframe-inspector
      material={{ src: this.props.marker_url}}  shadow position="0 0 0" rotation="-90 0 0" />
    } else {
       return <Entity key={`no-marker-${this.props.pieceId}`} geometry={{primitive: 'plane'}} data-aframe-inspector  id="marker-box" shadow position="0 0 0" rotation="-90 0 0"  />
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

  selectTool = (tool) => {
    Events.emit('transformmodechange',tool)
    this.setState({ tool: tool })
  }

  toggleInspector = (on) => {
    if(this.state.inspector != on) {
      if(on) {
        AFRAME.INSPECTOR.open()
      } else {
        AFRAME.INSPECTOR.close()
      }
      this.setState({ inspector: on })

    }
  }

  renderTool = (tool, label) => {
    var cls = 'preview__tool'
    if(this.state.tool == tool) {
      cls +=" preview__tool--active"
    }
    return <div onClick={(e)=> this.selectTool(tool) } className={cls}>{label}</div>
  }

  renderToggle = (on, label) => {
    var cls = 'preview__tool'
    if(this.state.inspector == on) {
      cls +=" preview__tool--active"
    }
    return <div onClick={(e)=> this.toggleInspector(on) } className={cls}>{label}</div>
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
          orbit-controls={`target: 0 0 0; 
            minDistance: 0.5; 
            maxDistance: 100; 
            maxPolarAngle: 89;
            initialPosition: 0 ${marker_meter_width*5} ${marker_meter_width*5};`}
          />
      {this.renderMarkerImage()}
      <a-entity data-aframe-inspector ref={this.previewRef} scale={`${marker_meter_width} ${marker_meter_width} ${marker_meter_width}`}>
       </a-entity>
      </a-scene>
      <div className='preview__toggle'>
        {this.renderToggle(true,'||')}
        {this.renderToggle(false,'>')}
        </div>
      <div className='preview__tools'>
        {this.renderTool('translate','P')}
        {this.renderTool('rotate','R')}
        {this.renderTool('scale','S')}
      </div>
    </div>
    </div>
  }

}

export default PiecePreview;