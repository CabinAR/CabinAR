import React from 'react'

import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import cabinReducer from "../reducer";

import { Provider } from "react-redux";

import CabinArAppContainer from "./cabin_ar_app_container"



import { loadSpace } from '../actions'


class App extends React.Component {

 constructor(props) {
    super(props);

    // Initialize redux store
    let store = createStore(
      cabinReducer,
      this.baseStore(),
      composeWithDevTools(applyMiddleware(thunkMiddleware))
    );

    this.store = store;
  }

  componentDidMount() {
    this.store.dispatch(loadSpace(this.props.spaceId))
  }

  baseStore() {
    return {
      spaceId: this.props.spaceId,
      pieceId: null,
      space: {},
      pieces: [],
      index: {},
      gizmo: 'translate',
      aframePack: this.props.aframePack,
      showSaveAsModal: false,
      spaces: []
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <CabinArAppContainer/>
      </Provider>
      );
  }
}

export default App;