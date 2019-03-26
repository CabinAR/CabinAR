import { connect } from 'react-redux'

import PiecePreview from "./piece_preview.jsx"

import { 
  savePiece,
  deletePiece
 } from '../actions'

const mapStateToProps = (state, ownProps) => {
  const piece = state.index[state.pieceId]
  return { ...piece, pieceId: piece.id }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    savePiece: (pieceId) => { dispatch(savePiece(pieceId)) },
    deletePiece: (pieceId) => { dispatch(deletePiece(pieceId))}
  }
}

const PiecePreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PiecePreview)

export default PiecePreviewContainer;