import React from 'react'


import {UnControlled as CodeMirror} from 'react-codemirror2';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';




class CabinArApp extends React.Component {

  constructor(props) {
    super(props)

    this.previewRef = React.createRef()

    let code =  `
<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow></a-box>
<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow></a-sphere>
<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" shadow></a-cylinder>
<a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
`

    this.state = {
      code: code
    }
  }

  componentDidMount() {
    this.refresh()
  }

  onChange = (val) => {
    this.setState({ code: val })
  }

  refresh = () => {
    this.previewRef.current.innerHTML = this.state.code;
  }


  render() {
    // create a list of pieces
    // two tabs - options and code editor
    // right side is a preview
    return <div className='page-wrapper'>
      <div className='piece-list page-wrapper__item-list'>
        <button onClick={this.refresh}>Refresh</button>
      </div>
      <div className='page-wrapper__editor'>
      <div className='editor'>
       <AceEditor
          value={this.state.code}
          mode="html"
          theme="github"
          name="aframe-editor"
          editorProps={{$blockScrolling: true}}
          onChange={this.onChange}
        />
      </div>
      </div>
      <div className='preview page-wrapper__preview' >
         <a-scene background="color: #ECECEC" embedded>
          <a-entity ref={this.previewRef}>
           
          </a-entity>
          </a-scene>
    </div>

    </div>
  }

}


export default CabinArApp;