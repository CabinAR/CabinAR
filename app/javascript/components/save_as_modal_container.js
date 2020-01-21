import { connect } from 'react-redux'

import SaveAsModal from "./save_as_modal.jsx"

import { filter } from "lodash"

import {
  showSaveAs,
  refreshSpaces
} from "../actions"

const mapStateToProps = (state, ownProps) => {
  const piece = state.index[state.pieceId]
  const availableSpaces = filter(state.spaces, (space) => space.id !== state.spaceId && space.editable )
  return {
    piece: piece,
    spaces: availableSpaces
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    closeSaveAs: () => { dispatch(showSaveAs(false)) },
    refreshSpaces: () => dispatch(refreshSpaces())
  }
}

const SaveAsModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveAsModal)

export default SaveAsModalContainer;