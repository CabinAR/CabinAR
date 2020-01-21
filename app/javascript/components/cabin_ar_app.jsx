import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';

import PieceListContainer from './piece_list_container'
import PieceEditorContainer from './piece_editor_container'
import PiecePreviewContainer from './piece_preview_container'
import SaveAsModalContainer from './save_as_modal_container'

import Notifications from 'react-notify-toast';

import Dropzone from 'react-dropzone'



class CabinArApp extends React.Component {

  constructor(props) {
    super(props)

    let lastWidth = localStorage['cabinLastEditorWidth'];
    let hidePieces = !!localStorage['cabinHidePieces']

    this.state = {
      dragging: false,
      width: lastWidth,
      hidePieces: hidePieces
    }

    this.editorWrapperRef = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown, false);

    window.addEventListener('mousemove', this.onDrag, false);
    window.addEventListener('mouseup', this.endDrag, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown",this.onKeyDown);
    window.removeEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.endDrag, false);
  }

  onKeyDown = (e) => {
    if(e.keyCode == 83 && (e.metaKey || e.ctrlKey)) {
      this.props.saveCurrentPiece()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  addAssets = (acceptedFiles) => {
    this.props.addAsset(acceptedFiles)
  }

  render() {
    // create a list of pieces
    // two tabs - options and code editor
    // right side is a preview
    return  <Dropzone noClick={true} noKeyboard={true} onDrop={this.addAssets}>
    {({getRootProps, getInputProps}) => (
      <div className='page-dropzpone' {...getRootProps()} onClick={null} >
        <Notifications/>
        {this.renderWrapper()}
        </div>
    )}
    </Dropzone>
  }


  flexStyle = () => {
    return { 'flex': `1 0.0001 ${this.state.width || "40%"}` }
  }

  onDrag = (e) => {
    if(this.state.dragging) {
      let maxWidth = window.innerWidth - 500;
      var width = e.clientX - this.editorWrapperRef.current.offsetLeft 
      if(width > maxWidth) {
        width = maxWidth;
      }
      localStorage['cabinLastEditorWidth'] = `${width}px`
      this.setState({ width: `${width}px` })
    }
  }

  startDrag = (e) => {
    this.setState({ dragging: true })
  }

  endDrag = (e) => {
    if(this.state.dragging) {
      this.setState({ dragging: false })
    }
  }

  hidePieces = (e) => {
    localStorage['cabinHidePieces'] = 'true'
    this.setState({ hidePieces: true })
  }

  showPieces = (e) => {
    localStorage['cabinHidePieces'] = ''
    this.setState({ hidePieces: false })
  }

  renderWrapper() {
    const { pieceId } = this.props;

    return  <div className='page-wrapper' >
          {this.state.hidePieces && <div className='page-wrapper__show-tab' onClick={this.showPieces}>&raquo;</div> }
          <div className={`page-wrapper__piece-list ${this.state.hidePieces ? 'page-wrapper__piece-list--hidden' : ''}`} >
            <PieceListContainer />
            <div className='page-wrapper__hide-tab' onClick={this.hidePieces}>&laquo;</div>
          </div>
          <div ref={this.editorWrapperRef} className='page-wrapper__editor' style={this.flexStyle()}>
            {pieceId && <PieceEditorContainer/>}
            <div className='page-wrapper__resizer' onMouseDown={this.startDrag}></div>
          </div>
          <div className='preview page-wrapper__preview' >
            {pieceId && <PiecePreviewContainer />}
            {this.state.dragging && <div className='page-wrapper__blocker'></div>}
          </div>
          {this.props.showSaveAsModal && <SaveAsModalContainer/>}
        </div>
  }

}


export default CabinArApp;