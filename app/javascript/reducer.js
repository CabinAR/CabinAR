


let _allreducers = {};

import {
  LOAD_SPACE,
  UPDATE_PIECE,
  SELECT_PIECE,
  ADD_PIECE,
  DELETE_PIECE
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
  let piece = { ...index[action.pieceId], dirty: true, ...action.props }
  index[action.pieceId] = piece
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