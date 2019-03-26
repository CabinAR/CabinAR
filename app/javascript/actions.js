
import CabinAPI from "./cabin_api.js"

export const LOAD_SPACE = "LOAD_SPACE";
export const UPDATE_PIECE  = "UPDATE_PIECE";
export const SELECT_PIECE = "SELECT_PIECE";
export const ADD_PIECE = "ADD_PIECE";
export const DELETE_PIECE = 'DELETE_PIECE';

import { find } from 'lodash'

export function loadSpace(spaceId) {
  return function(dispatch,getState) {
    CabinAPI.space(spaceId).then((data) => {
      dispatch({
        type: LOAD_SPACE,
        space: data
      })

    })
  }
}


export function savePiece(pieceId) {
  return function(dispatch,getState) {
    const piece = getState().index[pieceId]
    dispatch(updatePiece(pieceId, { saving: true }))
    CabinAPI.savePiece(piece).then((data) => {
      let pieceData = { ...data, saving: false, dirty: true }
      dispatch(updatePiece(pieceId, pieceData))
    })
  }
}

export function deletePiece(pieceId) {
  return function(dispatch,getState) {
    CabinAPI.deletePiece(pieceId).then((data) => {
      dispatch({
        type: DELETE_PIECE,
        pieceId: pieceId
      })
    })

  }
}

export function updatePiece(pieceId, props) {
  return {
    type: UPDATE_PIECE,
    pieceId: pieceId,
    props: props
  }
}

export function selectPiece(pieceId) {
  return {
    type: SELECT_PIECE,
    pieceId: pieceId
  }
}


export function addPiece() {
  return function(dispatch,getState) {
    const spaceId = getState().spaceId;
    CabinAPI.createPiece(spaceId).then((data) => {
      dispatch({
        type: ADD_PIECE,
        piece: data
      })
    })
  }
}