import { connect } from 'react-redux'

import PiecePreview from "./piece_preview.jsx"

import { 
  savePiece,
  deletePiece,
  updatePiece,
  updateMarking,
  updateMapping
 } from '../actions'

const mapStateToProps = (state, ownProps) => {
  const piece = state.index[state.pieceId]
  return { ...piece, 
    pieceId: piece.id, 
    aframePack: state.aframePack,
    cursor: state.cursor,
    mapping: state.mapping
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    savePiece: (pieceId) => { dispatch(savePiece(pieceId)) },
    deletePiece: (pieceId) => { dispatch(deletePiece(pieceId))},
    updatePiece: (pieceId, props) => { dispatch(updatePiece(pieceId, props)) },
    codeMarking: (codeStart,codeEnd) => { dispatch(updateMarking(codeStart,codeEnd))},
    entityMapping: (mapping) => { dispatch(updateMapping(mapping)) }
  }
}

const PiecePreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PiecePreview)

export default PiecePreviewContainer;