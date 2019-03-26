import React from 'react'

import { map } from "lodash"

class PieceList extends React.Component {

  renderPiece = (piece) => {
    const { selectPiece } = this.props;

    let pieceClass = 'piece-list__piece';
    if(this.props.selected == piece.id) {
      pieceClass += ' piece-list__piece--active'
    }
    return <div onClick={() => { selectPiece(piece.id) }} key={piece.id} className={pieceClass}>
      {piece.name || "Unnamed"}
    </div>
  }


  render() {
    return <div className='piece-list'>
      {map(this.props.pieces, this.renderPiece)}

      <div className='piece-list__add-piece' onClick={this.props.addPiece} >
      + Add Piece
      </div>

    </div>

  }

}

export default PieceList;