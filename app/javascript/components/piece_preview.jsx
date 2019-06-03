import React from 'react'

import { debounce } from "lodash"

import Frame, { FrameContextConsumer } from 'react-frame-component';


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
    this.assetRef = React.createRef()
  }

  componentDidMount() {
  }

  removeObject = (e) => {
    this.outputScene()
  }


  outputScene = () => {
    this.props.updatePiece(this.props.pieceId, { scene: this.previewWindow.getEntityInnerRepresentation(this.previewRef.current), refresh: false } ) 
  }

  refreshNow= () => {
    if(this.aframeInspector()) { this.aframeInspector().deselect() }

    try { 
      //if(xmlChecker.check('<?xml version="1.0" encoding="UTF-8"?><scene>'+ this.props.scene.replace("\n"," ") + '</scene>')) {
        this.previewRef.current.innerHTML = this.props.scene
        this.assetRef.current.innerHTML = this.props.assets
        if(!this.state.inspector) {
          this.previewWindow.installBridge()
        }
      //}
    } catch(err) { 
      console.log(err)
      //note invalid XML
   }
  }

  installBridge() {
    window.installBridge(this.props.code)
  }

  refresh = debounce(() => { this.refreshNow() }, 500)

  shouldComponentUpdate(nextProps, nextState) {
    return true 
    //(nextProps.pieceId != this.props.pieceId) ||
    //       (nextProps.code != this.props.code)
  }

  componentDidUpdate(prevProps,prevState) {
    
    if(prevProps.pieceId != this.props.pieceId ||
       prevState.iframeMounted != this.state.iframeMounted) {
      // deselect selected piece
      this.refreshNow()
    } else if(prevProps.scene != this.props.scene) {
      if(this.props.refresh) {
        this.refresh()
      }
    }
  }

  renderMarkerImage() {
    const { marker_meter_width, marker_meter_height } = this.props;

    if(this.props.marker_url) {
      return <a-entity geometry={`primitive: plane; width:  ${marker_meter_width}; height: ${marker_meter_height}` }
      key={`marker-${this.props.pieceId}`}
      id="marker-box"  data-aframe-inspector
      material={`src: ${this.props.marker_url}`}  shadow position="0 0 0" rotation="-90 0 0" />
    } else {
       return <a-entity key={`no-marker-${this.props.pieceId}`} geometry="primitive: plane" color="#FFFFFF" data-aframe-inspector  id="marker-box" shadow position="0 0 0" rotation="-90 0 0"  />
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
    this.Events.emit('transformmodechange',tool)
    this.setState({ tool: tool })
  }

  toggleInspector = (on) => {
    if(this.state.inspector != on) {
      this.setState({ inspector: on },() => { 
        this.refreshNow()
        if(on) {
          this.aframeInspector().open()
        } else {
          this.aframeInspector().close()
        }
      })
    } else if(!on) {
      this.refreshNow()
    }
  }

  aframeInspector() {
    return this.previewWindow.AFRAME.INSPECTOR;
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

  renderScene() {
    if(!this.state.aframeMounted) { return null; }
        const { marker_meter_width } = this.props;

      return <a-scene background="color: #ECECEC" vr-mode-ui="enabled: false" cursor="rayOrigin: mouse" >
       <a-assets ref={this.assetRef}></a-assets>

      {this.renderMarkerImage()}
      <a-entity class='cabinar-wrapper' data-aframe-inspector ref={this.previewRef} scale={`${marker_meter_width} ${marker_meter_width} ${marker_meter_width}`}>
       </a-entity>
      </a-scene>
  }

  iframeHead() {
    const aframePack = this.props.aframePack;

    return `<!DOCTYPE html><html><head></head><body><div id="preview"></div><script src="${aframePack}"></script></body></html>`

  }

  iframeMounted = (document,window) => {
    this.previewDocument = document
    this.previewWindow = window
    this.Events = window.Events
    console.log("mounted")
    this.setState({ aframeMounted: true },() => {
      this.refreshNow();

      this.Events.emit('transformmodechange',this.props.gizmo)
      this.Events.on("updatedScene",this.outputScene)
      this.Events.on('objectremove', this.removeObject);
    })
  }

  render() {
    return <div className='preview'>
    <div className='preview__actions'>
      <button className='preview__delete' onClick={this.deletePiece}>Delete</button>
      <button className='preview__action button' onClick={this.savePiece}>Save</button>
    </div>
    <div className='preview__wrapper'>
      <Frame initialContent={this.iframeHead()} mountTarget='#preview' className='preview__iframe' ><div>
        {this.renderScene()}
      </div>
      <FrameContextConsumer>
      {
        // Callback is invoked with iframe's window and document instances
        ({document, window}) => {
          // Render Children
          window.addEventListener("load",() => this.iframeMounted(document,window))
        }
      }
    </FrameContextConsumer>
      </Frame>

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