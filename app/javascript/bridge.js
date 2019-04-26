

class Piece {

  onLoad = []
  onTick = []

  constructor(container) {
    this.container = container;
  }

  entity(id) {
    return this.container.querySelector("#" + id)
  }

  click(id,onClick) {
    this.entity(id).addEventListener("click",onClick)
  }

  load(onLoad) {
    this.onLoad.append(onLoad)
  }

  tick(onTick) {
    this.onTick.append(onLoad)
  }

  run(callbackString) {
    var $piece = this;
    eval(callbackString)
  }
}


window.installBridge = function installBridge(callbackString) {
  // Get all the top level entities in the scene 
  // ignoring the inspector ones

  var scene = AFRAME.scenes[0];
  var wrappers = scene.getElementsByClassName("cabinar-wrapper")


  var $piece = new Piece(wrappers[0])
  $piece.run(callbackString)
}

