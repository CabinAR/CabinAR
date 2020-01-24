if(navigator.xr)  {
  navigator.xr.requestDevice = navigator.xr.requestDevice || function () {
    return new Promise((resolve, reject) => {
      resolve({
        supportsSession: new Promise((resolve, reject) => {
          resolve({
            immersive: true,
            exclusive: true
          });
        })
      });
    });
  };
}

require('aframe')
require('aframe-orbit-controls');
require('aframe-text-geometry-component');
require("aframe-particle-system-component")


import Events from '../lib/Events';

window.Events = Events


require("../bridge")

import { getEntityInnerRepresentation } from "../lib/entity"

import { serializeRoot } from '../lib/serializer'

window.getEntityInnerRepresentation = getEntityInnerRepresentation
window.serializeRoot = serializeRoot



var Inspector;

window.addEventListener("DOMContentLoaded",function() {
  Inspector = require("../inspector").default
  AFRAME.INSPECTOR = new Inspector()
})