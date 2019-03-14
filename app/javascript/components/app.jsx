import React from 'react'

import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import cabinReducer from "../reducer";

import { Provider } from "react-redux";

import CabinArAppContainer from "./cabin_ar_app_container"


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
    //
  }

  baseStore() {
    return {
      pieces: [],
      index: {}
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