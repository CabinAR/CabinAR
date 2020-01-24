import React from 'react'

import { map, omit } from "lodash"

import CabinAPI from "../cabin_api.js"

class SaveAsModal extends React.Component {


  constructor(props) {
    super(props);
    props.refreshSpaces()

    this.state = {
      spaceId: null
    }
  }


  saveAs = () => {
    this.setState({saving: true})

    const pieceJSON= omit(this.props.piece,['undos'])
    CabinAPI.savePieceAs(pieceJSON, this.state.spaceId).then(() => {
      this.setState({ saved: true  })
    })
  }

  renderSelect() { 
    const { saved, spaceId } = this.state;
    const { spaces, closeSaveAs } = this.props;

    return <div className='properties__field'>
          <label htmlFor="save_as_space" 
                 className='properties__label'>
                 Save this piece to another space (select space):
          </label>
          <div className='properties__input'>
            <select 
              onChange={
                (e) => this.setState({"spaceId": e.currentTarget.value})
              } 
              value={spaceId || ""}
              >
              <option value=''></option>
              { map(spaces, (space) => <option key={space.id} value={space.id}>{space.name}</option>) }
            </select>
          </div>
        </div>
  }


  renderLink() {
    const { saved, spaceId } = this.state;
    return <div>Saved! <a href={`/spaces/${spaceId}`} target="_blank">visit space</a></div>
  }


  render() {
    const { saved, saving, spaceId } = this.state;
    const { spaces, closeSaveAs } = this.props;


    return <div className="modal__wrapper">
      <div className="modal__overlay"></div>
      <div className="modal__modal">
        <div className='modal__title'>Save As...</div>
        { saved ? this.renderLink() : this.renderSelect() }

        <div className="modal__actions">
          <button className="modal__cancel" onClick={this.props.closeSaveAs}>{saved ? 'close' : 'cancel' }</button>
          {!saved && <button className="modal__save" disabled={!spaceId || saving} onClick={this.saveAs}>{saving ? "Saving..." : "Save" }</button>}
        </div>
      </div>
    </div>
  }

}


export default SaveAsModal;