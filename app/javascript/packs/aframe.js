require('aframe')
require('aframe-orbit-controls');
require('aframe-text-geometry-component');
require("aframe-particle-system-component")


import Events from '../lib/Events';

window.Events = Events


require("../bridge")

import { getEntityInnerRepresentation } from "../lib/entity"

window.getEntityInnerRepresentation = getEntityInnerRepresentation



var Inspector;

window.addEventListener("DOMContentLoaded",function() {
  Inspector = require("../inspector").default
  AFRAME.INSPECTOR = new Inspector()
})