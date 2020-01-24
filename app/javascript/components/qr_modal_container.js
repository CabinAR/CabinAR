import { connect } from 'react-redux'

import QrModal from "./qr_modal.jsx"

import { filter } from "lodash"

import {
  showQr,
} from "../actions"

const mapStateToProps = (state, ownProps) => {
  return {
    spaceId: state.spaceId,
    cabinKey: state.cabinKey,
    rootUrl: state.rootUrl
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    closeQr: () => { dispatch(showQr(false)) }
  }
}

const QrModalContainer= connect(
  mapStateToProps,
  mapDispatchToProps
)(QrModal)

export default QrModalContainer;