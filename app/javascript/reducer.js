let _allreducers = {};


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