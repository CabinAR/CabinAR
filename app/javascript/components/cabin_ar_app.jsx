import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';

import PieceListContainer from './piece_list_container'
import PieceEditorContainer from './piece_editor_container'
import PiecePreviewContainer from './piece_preview_container'

import Notifications from 'react-notify-toast';

import Dropzone from 'react-dropzone'



class CabinArApp extends React.Component {

  constructor(props) {
    super(props)

  }

  addAssets = (acceptedFiles) => {
    this.props.addAsset(acceptedFiles)
  }

  render() {
    const { pieceId } = this.props;
    // create a list of pieces
    // two tabs - options and code editor
    // right side is a preview
    return  <Dropzone noClick={true} noKeyboard={true} onDrop={this.addAssets}>
    {({getRootProps, getInputProps}) => (
      <div className='page-dropzpone' {...getRootProps()}>
        <Notifications/>
        <input {...getInputProps()} />
        <div className='page-wrapper' >
          <div className='page-wrapper__piece-list'>
            <PieceListContainer />
          </div>
          <div className='page-wrapper__editor'>
            {pieceId && <PieceEditorContainer/>}
          </div>
          <div className='preview page-wrapper__preview' >
            {pieceId && <PiecePreviewContainer />}
          </div>
        </div>
        </div>
    )}
    </Dropzone>
  }

}


export default CabinArApp;