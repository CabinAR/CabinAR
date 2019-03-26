import { connect } from 'react-redux'

import PieceList from "./piece_list.jsx"

import { map } from "lodash"

import {
  selectPiece,
  addPiece 
} from "../actions"

const mapStateToProps = (state, ownProps) => {
  const pieceList = map(state.pieces, (pieceId) => state.index[pieceId])

  return {
    pieces: pieceList,
    selected: state.pieceId
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