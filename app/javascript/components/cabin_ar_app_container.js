import { connect } from 'react-redux'

import CabinArApp from "./cabin_ar_app.jsx"

import {
  addAsset,
  saveCurrentPiece
} from "../actions"


const mapStateToProps = (state, ownProps) => {
  return {
    pieceId: state.pieceId,
    showSaveAsModal: state.showSaveAsModal,
    showQrModal: state.showQrModal
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addAsset: (files) => { dispatch(addAsset(files)) },
    saveCurrentPiece: () => { dispatch(saveCurrentPiece())}
  }
}

const CabinArAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CabinArApp)

export default CabinArAppContainer;