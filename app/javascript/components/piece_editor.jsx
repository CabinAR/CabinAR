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

  }

  toast = notify.createShowQueue()

  changeCode = (val) => {
    let props = {}
    props[this.activeTab()] = val
    this.props.updatePiece(this.props.pieceId, props)
  }

  change = (field, e) => {
    let props = {}
    props[field] = e.currentTarget.value
    this.props.updatePiece(this.props.pieceId, props)
  }


  addFile = (e) => {
    const files = Array.from(e.target.files)

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    let errs = []
    let file = files[0]

    if (types.every(type => file.type !== type)) {
      errs.push(`'${file.type}' is not a supported format`)
    }

    if (file.size > 500000) {
      errs.push(`'${file.name}' is too large, please pick a smaller file`)
    }

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    } else {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.props.updatePiece(this.props.pieceId, { marker: file, marker_url: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  componentDidMount() {

  }

  activeTab() {
    return this.props.tab || "code"
  }


  codeToShow() {
    return this.props[this.activeTab()] || "";
  }

  tabs() {
    return [ "code", "properties" ]
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
        <div className='properties__input'>
          <label className='properties__label-button' htmlFor={label('upload')}>+ {this.props.marker_url ? 'Change' : 'Add'} Marker Image</label>
          <input type='file' id={label('upload')} className='editor__fileInput' onChange={this.addFile} /> 
        </div>
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
          mode="html"
          theme="github"
          width="auto"
          height="auto"
          wrapEnabled={true}
          name="aframe-editor"
          editorProps={{$blockScrolling: true}}
          onChange={this.changeCode}
        />
      </div>
  }

  render() {
    return <div className='editor'>
    <div className='editor__tabs'>
      { map(this.tabs(),this.renderTab) }

    </div>
    { this.activeTab() == 'properties' ? this.renderProperties() : this.renderEditor() }
    </div>
  }

}

export default PieceEditor;