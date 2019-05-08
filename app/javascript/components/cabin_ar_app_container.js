import { connect } from 'react-redux'

import CabinArApp from "./cabin_ar_app.jsx"

import {
  addAsset
} from "../actions"


const mapStateToProps = (state, ownProps) => {
  return {
    pieceId: state.pieceId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addAsset: (files) => { dispatch(addAsset(files)) }
  }
}

const CabinArAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CabinArApp)

export default CabinArAppContainer;