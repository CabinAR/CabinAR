import { connect } from 'react-redux'

import PiecePreview from "./piece_preview.jsx"

import { 
  savePiece,
  deletePiece,
  updatePiece
 } from '../actions'

const mapStateToProps = (state, ownProps) => {
  const piece = state.index[state.pieceId]
  return { ...piece, 
    pieceId: piece.id, 
    aframePack: state.aframePack 
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    savePiece: (pieceId) => { dispatch(savePiece(pieceId)) },
    deletePiece: (pieceId) => { dispatch(deletePiece(pieceId))},
    updatePiece: (pieceId, props) => { dispatch(updatePiece(pieceId, props)) }
  }
}

const PiecePreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PiecePreview)

export default PiecePreviewContainer;