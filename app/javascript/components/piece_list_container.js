import { connect } from 'react-redux'

import PieceList from "./piece_list.jsx"

import { map, find, sortBy } from "lodash"

import {
  selectPiece,
  addPiece 
} from "../actions"

const mapStateToProps = (state, ownProps) => {
  const pieceList = sortBy(map(state.pieces, (pieceId) => state.index[pieceId]), (piece) => piece.name || "")

  const dirty = find(pieceList, (piece) => piece.dirty)

  return {
    space: state.space,
    pieces: pieceList,
    selected: state.pieceId,
    dirty: dirty
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    selectPiece: (pieceId) => { dispatch(selectPiece(pieceId)) },
    addPiece: () => { dispatch(addPiece()) }
  }
}

const PieceListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PieceList)

export default PieceListContainer;