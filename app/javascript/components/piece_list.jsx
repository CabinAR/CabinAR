import React from 'react'

import { map } from "lodash"

class PieceList extends React.Component {


  renderPieceImage = (piece) => {
    if(piece.marker_url) {
      return <div className='piece-list__piece-image'><img src={piece.marker_url} /></div>
    }
  }

  renderUnsavedBadge = (piece) => {
    if(piece.dirty) {
      return <div className='piece-list__piece-unsaved'>unsaved</div>
    }
  }

  renderPiece = (piece) => {
    const { selectPiece } = this.props;

    let pieceClass = 'piece-list__piece';
    if(this.props.selected == piece.id) {
      pieceClass += ' piece-list__piece--active'
    }
    return <div onClick={() => { selectPiece(piece.id) }} key={piece.id} className={pieceClass}>
      {this.renderPieceImage(piece)}
      {this.renderUnsavedBadge(piece)}
      {piece.name || "Unnamed"}
    </div>
  }

  gotoMySpaces = () => {
    if(!this.props.dirty ||
     confirm("You have unsaved changes, really quit editor?")) {
      document.location = "/spaces"
    }
  }


  render() {
    return <div className='piece-list'>
      <div className='piece-list__back' onClick={this.gotoMySpaces}>&laquo; My Spaces</div>
      {map(this.props.pieces, this.renderPiece)}

      <div className='piece-list__add-piece button' onClick={this.props.addPiece} >
      + Add Piece
      </div>

    </div>

  }

}

export default PieceList;