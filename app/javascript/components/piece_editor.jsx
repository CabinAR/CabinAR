import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';

import { map, isEqual } from "lodash"

import {notify} from 'react-notify-toast';


const { Range } = brace.acequire("ace/range");

const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}


class PieceEditor extends React.Component {
  constructor(props) {
    super(props)

    this.aceEditor = React.createRef();
    this.uploadRef = React.createRef();
  }

  toast = notify.createShowQueue()

  changeCode = (val) => {
    let props = {}

    props[this.activeTab()] = val
    props['refresh'] = true // we want to refresh the preview
    this.props.updatePiece(this.props.pieceId, props)
  }

  cursorChange = (selection) => {
     this.props.updateCursor(selection.getCursor());
  }


  change = (field, e) => {
    let props = {}
    props[field] = e.currentTarget.value
    this.props.updatePiece(this.props.pieceId, props)
  }

  editor() {
   if(this.aceEditor.current) {
    return this.aceEditor.current.editor
   }
  }

  editorSession() {
    return this.editor().session;
  }

  componentDidMount() {
    this.setUndoManager()

    var session = this.editorSession();
    session.on("changeAnnotation", function() {
      var annotations = session.getAnnotations()||[];
      var len = annotations.length;
      var i = len;
      while (i--) {
        if(/doctype first\. Expected/.test(annotations[i].text)) {
          annotations.splice(i, 1);
        }
      }
      if(len>annotations.length) {
        session.setAnnotations(annotations);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.pieceId != this.props.pieceId ||
      prevProps.tab != this.props.tab &&
      this.editor()) {
      this.setUndoManager()
      this.clearMarking()
    }
    if(!isEqual(prevProps.marking, this.props.marking)) {
      this.setMarking(this.props.marking)
      //if(this.props.marking[0]) {
      //  var [ start ] = this.props.marking;
      //  this.editor().gotoLine(start[0] + 1 ,start[1]);
      //}
    }
  }

  setMarking([codeStart, codeEnd]) {
    this.clearMarking();
    if(this.editor() && this.activeTab() == "scene") { 

      if(!codeStart || !codeEnd) { return; }

      var range = new Range(codeStart[0], 
                            codeStart[1],
                            codeEnd[0],
                            codeEnd[1])
      this.marker = this.editorSession().addMarker(range, "selectedpiece", "text", true);
    }
  }

  clearMarking() {
    if(this.marker && this.editor()) {
      this.editorSession().removeMarker(this.marker);
    }
    this.marker = null;
  }


  addFile = (e) => {
    const files = Array.from(e.target.files)  
    this.props.addAsset(files)
  }


  activeTab() {
    return this.props.tab || "scene"
  }

  codeToShow() {
    return this.props[this.activeTab()] || "";
  }

  modeToShow() {
    return this.activeTab() == "code" ? "javascript" : "html"
  }

  setUndoManager() {
    if(this.editor()) { 
      this.editorSession().setUndoManager(
        this.props.undos[this.activeTab()] || new brace.UndoManager()
        )
    }
  }

  tabs() {
    // return [ "scene", "assets", "code",  "properties" ]
    return [ "scene", "assets", "properties" ]
  }

  renderTab = (tab) => {
    var classNames = 'editor__tab'

    if(tab == this.activeTab()) {
      classNames += " editor__tab--active"
    }
    return <div key={tab} className={classNames} onClick={() => this.clickTab(tab) }>
      {tab}
    </div>
  }

  clickTab = (tab) => {
    this.props.updatePiece(this.props.pieceId, { tab: tab })
  }


  label = (field) => {
    return `piece-${this.props.pieceId}-${field}`
  }

  deletePiece = () => {
    if(confirm("Are you sure you want to delete this piece?")) {
      this.props.deletePiece(this.props.pieceId);
    }
  }


  renderProperties() { 
    const label = this.label;

    return <div className='editor__properties'>

    <div className='properties'>

      <div className='properties__field'>
        <label htmlFor={label('name')} 
               className='properties__label'>
               Name:
        </label>
        <div className='properties__input'>
          <input value={this.props.name || ""} 
             onChange={(e) => this.change('name',e) }           
             id={label('name')} />
        </div>
      </div>

      <div className='properties__field'>
        <label htmlFor={label('marker_width')} 
               className='properties__label'>
               Marker Width:
        </label>
        <div className='properties__input'>
          <input value={this.props.marker_width || ""} 
                 onChange={(e) => this.change('marker_width',e) } 
                  id={label('marker_width')} />
          <select 
            onChange={
              (e) => this.change('marker_units',e) 
            } 
            value={this.props.marker_units || "inches"}>
            <option value='inches'>inches</option>
            <option value='feet'>feet</option>
            <option value='meters'>meters</option>
          </select>
        </div>
      </div>

      <div className='properties__field'>
        <label className='properties__label'>Marker:</label>
        &nbsp;Drag an image here or click button to change the marker.
      </div>
       {this.renderUpload("Marker")}
       {this.renderMarker()}

       <div className="properties__danger-zone">
         <div className="properties__danger-zone-title">Danger Zone - this can't be undone!</div>
         <button className='properties__danger button' onClick={this.deletePiece}>Delete this piece FOREVER</button>
       </div>
    </div>
    </div>    
  }

  renderMarker() {
    const markerUrl = this.props.marker_url
    const markerFile = this.props.markerDataUrl

    if(markerFile) {
      return <div className='editor__image-wrapper'>
        <div className='editor__save-needed'>
        Save this piece to update marker
        </div>
         <img className='editor__image' src={markerFile} />
      </div>
    } else if(markerUrl) {
      const markerQuality = this.props.marker_quality
      const markerClass = this.props.marker_quality === 0 ? 'editor__marker--zero' :
                          parseInt(this.props.marker_quality,10) < 75 ? 
                          "editor__marker--warning" : 'editor__marker--ok';

      return <React.Fragment>
        {markerQuality !== null && <div className={`editor__marker ${markerClass}`}>
          Marker Quality: {this.props.marker_quality}
          {this.props.marker_quality === 0 ? ". Unusuable Marker" : ""}
        </div>}
        <img className='editor__image' src={markerUrl} />
        </React.Fragment>
    }
  }

  renderEditor() {
    return <div className='editor__wrapper'>
       <AceEditor
          value={this.codeToShow()}
          mode={this.modeToShow()}
          theme="github"
          width="auto"
          ref={this.aceEditor}
          height="auto"
          wrapEnabled={true}
          name="aframe-editor"
          editorProps={{$blockScrolling: true}}
          onChange={this.changeCode}
          onCursorChange={this.cursorChange}
        />
      </div>
  }

  tools = [
    { name: "Sphere", code: `<a-sphere color="#FF0000"></a-sphere>`},
    { name: "Box", code: `<a-box color="#FF0000"></a-box>`},
    { name: "Cylinder", code: `<a-cylinder position="0 0 0 " radius="1" height="1.5" color="#00FF00"></a-cylinder>`},
    { name: "Plane", code: ` <a-plane width="4" height="4" color="#0000BB" rotation="-90 0 0"></a-plane>`},
    { name: "Text", code: `<a-entity text-geometry="value: CHANGE ME;" position="0 5 0" material="color: #000000"></a-entity>`}
  ]

  clickTool =(tool) => {
    this.editorSession().insert({
     row: this.editorSession().getLength(),
      column: 0
    }, "\n" + tool.code)
  }

  renderTool = (tool) =>  {
    return  <button key={tool.name} onClick={() => { this.clickTool(tool) }}className='button editor__tool'>{tool.name}</button>
  }


  renderTools() {
    return <div className='editor__tools'>
      {this.tools.map(this.renderTool)}
    </div>
  }

  clickUpload = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.uploadRef.current.click();
  }


  renderUpload(text) {
    const label = this.label;

    return <div className='editor__upload'>
          <input type='file' ref={this.uploadRef} id={label('upload-file')} className='editor__fileInput' onChange={this.addFile} />
          <button className='button-light' onClick={this.clickUpload}>+ Upload {text}</button>   
        </div>
  }
  

  render() {
    return <div className='editor'>
    <div className='editor__tabs'>
      { map(this.tabs(),this.renderTab) }
    </div>
    { this.activeTab() == 'scene' && this.renderTools() }        
    { this.activeTab() == 'properties' ? this.renderProperties() : this.renderEditor() }
    { this.activeTab() == 'assets' && this.renderUpload('asset') }
    </div>
  }

}

export default PieceEditor;