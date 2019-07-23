import { connect } from 'react-redux'

import PieceEditor from "./piece_editor"

import { 
  updatePiece,
  updateCursor
 } from '../actions'

const mapStateToProps = (state, ownProps) => {

  const piece = state.index[state.pieceId]
  return { ...piece, pieceId: piece.id, marking: state.marking, mapping: state.mapping }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePiece: (pieceId, props) => { dispatch(updatePiece(pieceId, props)) },
    updateCursor: (cursor) => { dispatch(updateCursor(cursor))}
  }
}

const PieceEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PieceEditor)

export default PieceEditorContainer;