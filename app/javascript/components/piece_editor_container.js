import { connect } from 'react-redux'

import PieceEditor from "./piece_editor"

import { 
  updatePiece
 } from '../actions'

const mapStateToProps = (state, ownProps) => {

  const piece = state.index[state.pieceId]
  return { ...piece, pieceId: piece.id }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePiece: (pieceId, props) => { dispatch(updatePiece(pieceId, props)) },
  }
}

const PieceEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PieceEditor)

export default PieceEditorContainer;