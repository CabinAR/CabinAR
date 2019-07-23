


let _allreducers = {};

import {
  LOAD_SPACE,
  UPDATE_PIECE,
  SELECT_PIECE,
  ADD_PIECE,
  DELETE_PIECE,
  UPDATE_MARKING,
  UPDATE_MAPPING,
  UPDATE_CURSOR
} from './actions'

import { map, uniq, reject } from 'lodash'
var brace = require('brace');

add(LOAD_SPACE,(state, action) => {
  let index = {}
  let pieces = map(action.space.pieces, (piece) => {

    piece.undos = {
      scene: new brace.UndoManager(),
      code: new brace.UndoManager(),
      assets: new brace.UndoManager()
    }

    index[piece.id] = piece


    return piece.id
  })

  let pieceId = index[state.pieceId] || pieces[0]

  return { ...state,
    space: action.space,
    pieceId: pieceId,
    pieces: pieces,
    index: index
  }
  
})


add(UPDATE_PIECE, (state, action) => {
  let index = { ...state.index }
  let oldPiece = index[action.pieceId]
  let newPiece = { ...oldPiece, ...action.props }

  var dirty = oldPiece.code != newPiece.code  ||
              oldPiece.scene != newPiece.scene ||
              oldPiece.assets != newPiece.assets ||
              oldPiece.marker != newPiece.marker

  if(action.dirty !== undefined) {
    dirty = action.dirty
  }


  index[action.pieceId] = { ...newPiece, dirty }
  return { ...state, index }
})

add(SELECT_PIECE, (state, action) => {
  return { ...state, pieceId: action.pieceId }
})

add(ADD_PIECE, (state, action) => {
  let index = { ...state.index }
  let piece = {...action.piece}

  piece.undos = {
      scene: new brace.UndoManager(),
      code: new brace.UndoManager(),
      assets: new brace.UndoManager()
    }

  index[piece.id] = piece
  let pieces = uniq([piece.id].concat(state.pieces))

  return { ...state, index, pieces, pieceId: action.piece.id }
})

add(DELETE_PIECE, (state, action) => {
  let pieceId = action.pieceId

  let index = { ...state.index }
  let pieces = reject(state.pieces, (pid) => pid == pieceId)

  let nextPieceId = pieces[0]

  delete index[pieceId]

  return { ...state, index, pieces, pieceId: nextPieceId }
})

add(UPDATE_MARKING, (state, action) => {
  return { ...state, marking: [ action.codeStart, action.codeEnd ] }
})

add(UPDATE_MAPPING, (state, action) => {
  return { ...state, mapping: action.mapping }
})

add(UPDATE_CURSOR, (state, action) => {
  return { ...state, cursor: action.cursor }
})

function add(name, reducer) {
  _allreducers[name] = _allreducers[name] || []
  _allreducers[name].push(reducer)
}

function run(state,action) {
  if(!_allreducers[action.type]) return state;
  _allreducers[action.type].map((reducer) => {
    state = reducer(state, action)
  })
  return state;
}




export default run;