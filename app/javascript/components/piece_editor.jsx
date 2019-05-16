import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';

import { map } from "lodash"

import {notify} from 'react-notify-toast';


const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}


class PieceEditor extends React.Component {
  constructor(props) {
    super(props)

    this.aceEditor = React.createRef()
  }

  toast = notify.createShowQueue()

  changeCode = (val) => {
    let props = {}

    props[this.activeTab()] = val
    props['refresh'] = true // we want to refresh the preview
    this.props.updatePiece(this.props.pieceId, props)
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
    }
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
        Drag to add marker.
      </div>
       {this.renderMarker()}
    </div>
    </div>    
  }

  renderMarker() {
    const markerUrl = this.props.marker_url

    if(markerUrl) {
      return <img className='editor__image' src={markerUrl} />
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
    this.editorSession().insert(this.editor().getCursorPosition(), tool.code)
  }

  renderTool = (tool) =>  {
    return  <button key={tool.name} onClick={() => { this.clickTool(tool) }}className='button editor__tool'>{tool.name}</button>
  }


  renderTools() {
    return <div className='editor__tools'>
      {this.tools.map(this.renderTool)}
    </div>
  }

  render() {
    return <div className='editor'>
    <div className='editor__tabs'>
      { map(this.tabs(),this.renderTab) }
    </div>
    { this.activeTab() == 'properties' ? this.renderProperties() : this.renderEditor() }
    { this.activeTab() == 'scene' && this.renderTools() }
    </div>
  }

}

export default PieceEditor;