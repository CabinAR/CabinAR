
import CabinAPI from "./cabin_api.js"

export const LOAD_SPACE = "LOAD_SPACE";
export const UPDATE_PIECE  = "UPDATE_PIECE";
export const SELECT_PIECE = "SELECT_PIECE";
export const ADD_PIECE = "ADD_PIECE";
export const DELETE_PIECE = 'DELETE_PIECE';

import { find, omit } from 'lodash'

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

export function saveCurrentPiece() {
  return function(dispatch,getState) {
    var currentPieceId = getState().pieceId
    if(currentPieceId) {
      dispatch(savePiece(currentPieceId))
    }
  }
}

export function savePiece(pieceId) {
  return function(dispatch,getState) {
    const piece = getState().index[pieceId]
    dispatch(updatePiece(pieceId, { saving: true }))

    const pieceJSON= omit(piece,['undos'])
    CabinAPI.savePiece(pieceJSON).then((data) => {
      let pieceData = { ...data, marker: null, markerDataUrl: null, saving: false, dirty: false }
      dispatch(updatePiece(pieceId, pieceData))
    })
  }
}

export function addAsset(files) {
  return function(dispatch, getState) {
    var pieceId = getState().pieceId

    var piece = getState().index[pieceId]

    if(piece.tab == "properties") {
      dispatch(addMarkerFile(pieceId,files))
    } else {
      CabinAPI.saveAsset(pieceId, files).then((data) => {
        dispatch(addAssetCode(pieceId, data.assets, data.scene))
      })
    }
  }
}


function addMarkerFile(pieceId,files) {
  return function(dispatch, getState) {
    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    let errs = []
    let file = files[0]

    if (types.every(type => file.type !== type)) {
      errs.push(`'${file.type}' is not a supported format`)
    }

    if (file.size > 1500000) {
      errs.push(`'${file.name}' is too large, please pick a smaller file`)
    }

    if (errs.length) {
      //return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    } else {
      let reader = new FileReader()
      reader.onload = (e) => {
        dispatch(updatePiece(pieceId, { marker: file, markerDataUrl: reader.result  }))
      }
      reader.readAsDataURL(file)
    }
  }
}



export function addAssetCode(pieceId, assets, scene) {
  return function(dispatch, getState) {
    var piece = getState().index[pieceId]

    var existing_assets = piece.assets || ""
    existing_assets += "\n" + assets

    var existing_scene = piece.scene || ""
    if(existing_scene != "") {
      existing_scene += "\n" + scene
    }

    dispatch(updatePiece(pieceId,{ assets: existing_assets, scene: existing_scene, dirty: true }))
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