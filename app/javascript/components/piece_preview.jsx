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
    //console.log(this.previewWindow.getEntityInnerRepresentation(this.previewRef.current))
    var { lines, mapping } = this.previewWindow.serializeRoot(this.previewRef.current)
    this.props.updatePiece(this.props.pieceId, { scene: lines.join("\n"), refresh: false } )
    this.props.entityMapping(mapping)
  }

  refreshNow= () => {
    if(this.aframeInspector()) { this.aframeInspector().deselect() }

    try { 
      //if(xmlChecker.check('<?xml version="1.0" encoding="UTF-8"?><scene>'+ this.props.scene.replace("\n"," ") + '</scene>')) {
        this.previewRef.current.innerHTML = this.props.scene
        this.assetRef.current.innerHTML = this.props.assets; 
        if(!this.state.inspector) {
          this.previewWindow.installBridge()
        }
      //}
    var { lines, mapping } = this.previewWindow.serializeRoot(this.previewRef.current)
    this.props.entityMapping(mapping)      
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

  activeTab() {
    return this.props.tab || "scene"
  }


  componentDidUpdate(prevProps,prevState) {
    
    if(prevProps.pieceId != this.props.pieceId ||
       prevState.iframeMounted != this.state.iframeMounted) {
      // deselect selected piece
      this.refreshNow()
      this.outputScene()
    } else if(prevProps.scene != this.props.scene) {
      if(this.props.refresh) {
        this.refresh()
         this.props.codeMarking(null,null)
      } else {
        // We were updated from updateScene
        if(this.aframeInspector() && 
          this.aframeInspector().selected &&
          this.aframeInspector().selected.el) {
            var entity = this.aframeInspector().selected.el
            this.props.codeMarking(entity.codeStart,entity.codeEnd)
        }
      }
    } else if(prevProps.cursor != this.props.cursor) {
      this.updateSelectionFromCursor()
    }
  }

  updateSelectionFromCursor() {
    // Don't update from assets
    if(this.activeTab() != "scene") {  return; }

    var {row,column} = this.props.cursor;

     var { mapping } = this.props
    
    if(mapping) {
      for(var i = 0;i < mapping.length;i++) {
        var cur = mapping[i];

        if((row == cur[0][0] && 
            column >= cur[0][1]) ||
          (row == cur[1][0] &&
            column <= cur[1][1]) ||
          ( row > cur[0][0] &&
            row < cur[1][0])) {
          if(cur[2] && cur[2].object3D) {
            try {
              this.selectedEntity = cur[2]
              this.aframeInspector().selectEntity(cur[2])
            } catch(e) {
              this.selectedEntity = null;
            }
          }
          break;
        }
      }
    }
  }



  renderMarkerAsset() {
    if(this.props.marker_url) {
      return <img id={`marker-image-${this.props.pieceId}`} crossOrigin="anonymous" src={this.props.marker_url} />
    }
    return null;
  }

  renderMarkerImage() {
    const { marker_meter_width, marker_meter_height } = this.props;

    if(this.props.marker_url) {
      return <a-entity geometry={`primitive: plane; width:  ${marker_meter_width}; height: ${marker_meter_height}` }
      key={`marker-${this.props.pieceId}`}
      id="marker-box"  data-aframe-inspector
      material={`src: #marker-image-${this.props.pieceId}`}
       shadow position="0 0 0" rotation="-90 0 0" />
    } else {
       return <a-entity key={`no-marker-${this.props.pieceId}`} geometry="primitive: plane" color="#FFFFFF" data-aframe-inspector  id="marker-box" shadow position="0 0 0" rotation="-90 0 0"  />
    }
  }

  savePiece = () => {
    this.props.savePiece(this.props.pieceId);
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
       <a-assets>
        {this.renderMarkerAsset()}
        <div ref={this.assetRef}></div>
       </a-assets>

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
    this.setState({ aframeMounted: true },() => {
      this.refreshNow();

      this.Events.emit('transformmodechange',this.props.gizmo)
      this.Events.on("updatedScene",this.outputScene)
      this.Events.on('objectremove', this.removeObject);
      this.Events.on("entityselect",this.selectObject)

      this.outputScene()
    })
  }

  selectObject = (entity) => {
    if(entity != this.selectedEntity) {
      this.outputScene()
      this.selectedEntity = entity;
    }
    this.props.codeMarking(entity.codeStart,entity.codeEnd)
  }

  render() {
    var { dirty, editable } = this.props;
    
    return <div className='preview'>
    <div className='preview__actions'>
      { editable && <button className={`preview__action button ${dirty ? 'preview__action--dirty' : ''}`} onClick={this.savePiece}>Save</button> }
      <button className="preview__action button" onClick={this.props.showSaveAs}>...</button>
    </div>
    <div className='preview__wrapper'>
      <Frame initialContent={this.iframeHead()} mountTarget='#preview' className='preview__iframe' ><div>
        {this.renderScene()}
      </div>
      <FrameContextConsumer>
      {
        // Callback is invoked with iframe's window and document instances
        ({document, window}) => {
          if(!this.state.aframeMounted) {
            var self = this;
            // Render Children
            function prepCallback() {
              if(window.AFRAME && window.AFRAME.INSPECTOR) {
                self.iframeMounted(document,window)
              } else {
                setTimeout(prepCallback,50)
              }
            }
            setTimeout(prepCallback,50)
          }
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