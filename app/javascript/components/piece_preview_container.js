import { connect } from 'react-redux'

import PiecePreview from "./piece_preview.jsx"

import { 
  savePiece,
  deletePiece,
  updatePiece,
  updateMarking,
  updateMapping,
  showSaveAs
 } from '../actions'

const mapStateToProps = (state, ownProps) => {
  const piece = state.index[state.pieceId]
  return { ...piece, 
    pieceId: piece.id, 
    aframePack: state.aframePack,
    cursor: state.cursor,
    mapping: state.mapping,
    editable: state.space.editable
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showSaveAs: () => { dispatch(showSaveAs(true)) },
    savePiece: (pieceId) => { dispatch(savePiece(pieceId)) },
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