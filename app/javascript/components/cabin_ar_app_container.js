import { connect } from 'react-redux'

import CabinArApp from "./cabin_ar_app.jsx"


const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { }
}

const CabinArAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CabinArApp)

export default CabinArAppContainer;