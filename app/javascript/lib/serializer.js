
import { equal } from './utils.js';

/*
  - Loop over all of an entities children
  - create a tree of dom elements 
  - build up an tree of 

    Turn any text nodes that aren't just whitespace into comment nodes, do the same thing on save


    var editor = ace.edit("editor");
    var Range = ace.require('ace/range').Range;
    editor.setReadOnly(true);
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
    setTimeout(function() {
      //editor.gotoLine(154);
      editor.session.addMarker(new Range(10, 0, 15, 0), "ace_active-line", "fullLine");
      editor.session.addMarker(new Range(4, 0, 8, 5), "foo", "line");
       editor.session.addMarker(new Range(15, 4, 19, 8), "bar", "text");
    }, 100);
</script>
*/


function linesRange(outputLines) {
  let rows = outputLines.length;
  let cols = outputLines[rows-1].length
  return [ rows-1, cols]
}

function outputEntityTagStart(entity, outputLines) {
  // loop over all the attributes in a tag
  // downcase the tag name
  let cleanedAttributes = outputAttributes(entity);
  let spacer = cleanedAttributes.length == 0 ? "" : " ";
  let tagStart = `<${entity.tagName.toLowerCase()}${spacer}`;

  return `${tagStart}${cleanedAttributes.join(" ")}>`
}

export function serializeRoot(entity) {
  var outputLines = [""]
  var nodeMapping = []

  serializeEntity(entity, outputLines, nodeMapping, 0)

  return { lines: outputLines, mapping: nodeMapping }
}

function prefixForLevel(level) {
  if(level <= 1) { return ""; }
  return "\t".repeat(level - 1)
}

/**
 * Returns a copy of the DOM hierarchy prepared for serialization.
 * The process optimises component representation to avoid values coming from
 * primitive attributes, mixins and defaults.
 *
 * @param {Element} entity Root of the DOM hierarchy.
 * @return {Elment}        Copy of the DOM hierarchy ready for serialization.
 */
export function serializeEntity(entity, outputLines, nodeMapping, level) {

  if(level > 0) {
    appendNodeText(outputLines,prefixForLevel(level))
    entity.codeStart = linesRange(outputLines)
    appendNodeText(outputLines,outputEntityTagStart(entity,outputLines))
  }
  var children = entity.childNodes;
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    if(child.nodeType == Node.TEXT_NODE) {
      appendNodeText(outputLines, child.textContent)      
    } else if(child.nodeType == Node.COMMENT_NODE) {
      appendNodeText(outputLines, `<!--${child.textContent}-->`)
    } else if (
      child.nodeType == Node.ELEMENT_NODE ||
      (!child.hasAttribute('aframe-injected') &&
        !child.hasAttribute('data-aframe-inspector') &&
        !child.hasAttribute('data-aframe-canvas'))
    ) {
      clearWhitespace(outputLines)
      if(level > 0 || i > 0) {
        appendNodeText(outputLines,"\n")
      }
      serializeEntity(children[i],outputLines, nodeMapping, level + 1)
    }
   
  }

  if(level > 0) {
    clearWhitespace(outputLines)
    if(children.length > 0) {
      appendNodeText(outputLines,"\n")
      appendNodeText(outputLines,prefixForLevel(level))
    }
    appendNodeText(outputLines,`</${entity.tagName.toLowerCase()}>`)
    entity.codeEnd = linesRange(outputLines)
    nodeMapping.push([ entity.codeStart, entity.codeEnd, entity])
  }
  return outputLines;
}

function clearWhitespace(outputLines) {
  var lastIdx = outputLines.length - 1
  var lastLine = outputLines[lastIdx]
  lastLine = lastLine.replace(/[\t n]+$/,"")
  outputLines[lastIdx] = lastLine
  if(outputLines[lastIdx] == "" && lastIdx > 0) {
    outputLines.pop()
    clearWhitespace(outputLines)
  }
}


function appendNodeText(outputLines, text) {
  let splitText = text.split("\n")

  var lastLine = outputLines.length - 1;
  outputLines[lastLine] += splitText[0]

  for(var i = 1; i < splitText.length;i++) {
    lastLine += 1;
    outputLines.push("")
    outputLines[lastLine] += splitText[i]
  }
}

function outputAttributes(entity) {
  let output = []
  var components = entity.components || {};

  var copy = entity.cloneNode(false)

  var removeAttribute = HTMLElement.prototype.removeAttribute;
  var setAttribute = HTMLElement.prototype.setAttribute;
  var getAttribute = HTMLElement.prototype.getAttribute;

  Object.keys(components).forEach(function(name) {
    var component = components[name];
    var result = getImplicitValue(component, entity);
    var isInherited = result[1];
    var implicitValue = result[0];
    var currentValue = entity.getAttribute(name);
    var optimalUpdate = getOptimalUpdate(
      component,
      implicitValue,
      currentValue
    );

    if(name == "position" ||
       name == "rotation" ||
       name == "scale" || 
       name == "material" ||
       name == "geometry") {
      var doesNotNeedUpdate = optimalUpdate === null;
      if (isInherited && doesNotNeedUpdate) {
        removeAttribute.call(copy, name);
      } else {
        var schema = component.schema;
        var value = stringifyComponentValue(schema, optimalUpdate);
        if(value == "" && (name == 'material' || name == 'geometry')) {
         removeAttribute.call(copy, name);
        } else {
          setAttribute.call(copy, name, value);
        }
      }
    } else {
      setAttribute.call(copy, name, getAttribute.call(entity,name))
    }
  });

  // loop over each of the attributes
  for(var i = 0;i<copy.attributes.length;i++) {
    var name = copy.attributes[i].name;
    var value = copy.attributes[i].value;

    output.push(`${name}="${value.replace('"',"&quot;")}"`)
  }
  return output;
}

function optimizeComponent(name,currentValue,component,source) {
  var result = getImplicitValue(component, source);
  var isInherited = result[1];
  var implicitValue = result[0];
  var optimalUpdate = getOptimalUpdate(
      component,
      implicitValue,
      currentValue
    );

  if(name == "position" ||
       name == "rotation" ||
       name == "scale" //|| 
       //name == "material" ||
       //name == "geometry"
       ) {
      var doesNotNeedUpdate = optimalUpdate === null;
      if (isInherited && doesNotNeedUpdate) {
        return null;
      } else {
        var schema = component.schema;
        var value = stringifyComponentValue(schema, optimalUpdate);
        if(value == "" && (name == 'material' || name == 'geometry')) {
          return null;
        } else {
          return value;
        }
      }
    } else {
      return currentValue;
    }

}


/**
 * @param  {Schema} schema The component schema.
 * @param  {any}    data   The component value.
 * @return {string}        The string representation of data according to the
 *                         passed component's schema.
 */
function stringifyComponentValue(schema, data) {
  data = typeof data === 'undefined' ? {} : data;
  if (data === null) {
    return '';
  }
  return (isSingleProperty(schema) ? _single : _multi)();

  function _single() {
    return schema.stringify(data);
  }

  function _multi() {
    var propertyBag = {};
    Object.keys(data).forEach(function(name) {
      if (schema[name]) {
        propertyBag[name] = schema[name].stringify(data[name]);
      }
    });
    return AFRAME.utils.styleParser.stringify(propertyBag);
  }
}

/**
 * Computes the value for a component coming from primitive attributes,
 * mixins, primitive defaults, a-frame default components and schema defaults.
 * In this specific order.
 *
 * In other words, it is the value of the component if the author would have not
 * overridden it explicitly.
 *
 * @param {Component} component Component to calculate the value of.
 * @param {Element}   source    Element owning the component.
 * @return                      A pair with the computed value for the component of source and a flag indicating if the component is completely inherited from other sources (`true`) or genuinely owned by the source entity (`false`).
 */
function getImplicitValue(component, source) {
  var isInherited = false;
  var value = (isSingleProperty(component.schema) ? _single : _multi)();
  return [value, isInherited];

  function _single() {
    var value = getMixedValue(component, null, source);
    if (value === undefined) {
      value = getInjectedValue(component, null, source);
    }
    if (value !== undefined) {
      isInherited = true;
    } else {
      value = getDefaultValue(component, null, source);
    }
    if (value !== undefined) {
      // XXX: This assumes parse is idempotent
      return component.schema.parse(value);
    }
    return value;
  }

  function _multi() {
    var value;

    Object.keys(component.schema).forEach(function(propertyName) {
      var propertyValue = getFromAttribute(component, propertyName, source);
      if (propertyValue === undefined) {
        propertyValue = getMixedValue(component, propertyName, source);
      }
      if (propertyValue === undefined) {
        propertyValue = getInjectedValue(component, propertyName, source);
      }
      if (propertyValue !== undefined) {
        isInherited = isInherited || true;
      } else {
        propertyValue = getDefaultValue(component, propertyName, source);
      }
      if (propertyValue !== undefined) {
        var parse = component.schema[propertyName].parse;
        value = value || {};
        // XXX: This assumes parse is idempotent
        value[propertyName] = parse(propertyValue);
      }
    });

    return value;
  }
}

/**
 * Gets the value for the component's property coming from a primitive
 * attribute.
 *
 * Primitives have mappings from attributes to component's properties.
 * The function looks for a present attribute in the source element which
 * maps to the specified component's property.
 *
 * @param  {Component} component    Component to be found.
 * @param  {string}    propertyName Component's property to be found.
 * @param  {Element}   source       Element owning the component.
 * @return {any}                    The value of the component's property coming
 *                                  from the primitive's attribute if any or
 *                                  `undefined`, otherwise.
 */
function getFromAttribute(component, propertyName, source) {
  var value;
  var mappings = source.mappings || {};
  var route = component.name + '.' + propertyName;
  var primitiveAttribute = findAttribute(mappings, route);
  if (primitiveAttribute && source.hasAttribute(primitiveAttribute)) {
    value = source.getAttribute(primitiveAttribute);
  }
  return value;

  function findAttribute(mappings, route) {
    var attributes = Object.keys(mappings);
    for (var i = 0, l = attributes.length; i < l; i++) {
      var attribute = attributes[i];
      if (mappings[attribute] === route) {
        return attribute;
      }
    }
    return undefined;
  }
}

/**
 * Gets the value for a component or component's property coming from mixins of
 * an element.
 *
 * If the component or component's property is not provided by mixins, the
 * functions will return `undefined`.
 *
 * @param {Component} component      Component to be found.
 * @param {string}    [propertyName] If provided, component's property to be
 *                                   found.
 * @param {Element}   source         Element owning the component.
 * @return                           The value of the component or components'
 *                                   property coming from mixins of the source.
 */
function getMixedValue(component, propertyName, source) {
  var value;
  var reversedMixins = source.mixinEls.reverse();
  for (var i = 0; value === undefined && i < reversedMixins.length; i++) {
    var mixin = reversedMixins[i];
    if (mixin.attributes.hasOwnProperty(component.name)) {
      if (!propertyName) {
        value = mixin.getAttribute(component.name);
      } else {
        value = mixin.getAttribute(component.name)[propertyName];
      }
    }
  }
  return value;
}

/**
 * Gets the value for a component or component's property coming from primitive
 * defaults or a-frame defaults. In this specific order.
 *
 * @param {Component} component      Component to be found.
 * @param {string}    [propertyName] If provided, component's property to be
 *                                   found.
 * @param {Element}   source         Element owning the component.
 * @return                           The component value coming from the
 *                                   injected default components of source.
 */
function getInjectedValue(component, propertyName, source) {
  var value;
  var primitiveDefaults = source.defaultComponentsFromPrimitive || {};
  var aFrameDefaults = source.defaultComponents || {};
  var defaultSources = [primitiveDefaults, aFrameDefaults];
  for (var i = 0; value === undefined && i < defaultSources.length; i++) {
    var defaults = defaultSources[i];
    if (defaults.hasOwnProperty(component.name)) {
      if (!propertyName) {
        value = defaults[component.name];
      } else {
        value = defaults[component.name][propertyName];
      }
    }
  }
  return value;
}

/**
 * Gets the value for a component or component's property coming from schema
 * defaults.
 *
 * @param {Component} component      Component to be found.
 * @param {string}    [propertyName] If provided, component's property to be
 *                                   found.
 * @param {Element}   source         Element owning the component.
 * @return                           The component value coming from the schema
 *                                   default.
 */
function getDefaultValue(component, propertyName, source) {
  if (!propertyName) {
    return component.schema.default;
  }
  return component.schema[propertyName].default;
}

/**
 * Returns the minimum value for a component with an implicit value to equal a
 * reference value. A `null` optimal value means that there is no need for an
 * update since the implicit value and the reference are equal.
 *
 * @param {Component} component Component of the computed value.
 * @param {any}       implicit  The implicit value of the component.
 * @param {any}       reference The reference value for the component.
 * @return                      the minimum value making the component to equal
 *                              the reference value.
 */
function getOptimalUpdate(component, implicit, reference) {
  if (equal(implicit, reference)) {
    return null;
  }
  if (isSingleProperty(component.schema)) {
    return reference;
  }
  var optimal = {};
  Object.keys(reference).forEach(function(key) {
    var needsUpdate = !equal(reference[key], implicit[key]);
    if (needsUpdate) {
      optimal[key] = reference[key];
    }
  });
  return optimal;
}


function isSingleProperty(schema) {
  if ('type' in schema) {
    return typeof schema.type === 'string';
  }

  return 'default' in schema;
}

/**
 * @param {Schema} schema Component's schema to test if it is single property.
 * @return                `true` if component is single property.
 */
/*function isSingleProperty(schema) {
  return AFRAME.schema.isSingleProperty(schema);
}*/

/**
 * Detect element's Id collision and returns a valid one
 * @param  {string} baseId Proposed Id
 * @return {string}        Valid Id based on the proposed Id
 */
function getUniqueId(baseId) {
  if (!document.getElementById(baseId)) {
    return baseId;
  }

  var i = 2;
  // If the baseId ends with _#, it extracts the baseId removing the suffix
  var groups = baseId.match(/(\w+)-(\d+)/);
  if (groups) {
    baseId = groups[1];
    i = groups[2];
  }

  while (document.getElementById(baseId + '-' + i)) {
    i++;
  }

  return baseId + '-' + i;
}

export function getComponentClipboardRepresentation(entity, componentName) {
  /**
   * Get the list of modified properties
   * @param  {Element} entity        Entity where the component belongs
   * @param  {string} componentName Component name
   * @return {object}               List of modified properties with their value
   */
  function getModifiedProperties(entity, componentName) {
    var data = entity.components[componentName].data;
    var defaultData = entity.components[componentName].schema;
    var diff = {};
    for (var key in data) {
      // Prevent adding unknown attributes
      if (!defaultData[key]) {
        continue;
      }

      var defaultValue = defaultData[key].default;
      var currentValue = data[key];

      // Some parameters could be null and '' like mergeTo
      if ((currentValue || defaultValue) && currentValue !== defaultValue) {
        diff[key] = data[key];
      }
    }
    return diff;
  }

  const diff = getModifiedProperties(entity, componentName);
  const attributes = AFRAME.utils.styleParser
    .stringify(diff)
    .replace(/;|:/g, '$& ');
  return `${componentName}="${attributes}"`;
}

function isEmpty(string) {
  return string === null || string === '';
}

/**
 * Entity representation.
 */
const ICONS = {
  camera: 'fa-camera',
  mesh: 'fa-cube',
  light: 'fa-lightbulb-o',
  text: 'fa-font'
};
export function printEntity(entity, onDoubleClick) {
  if (!entity) {
    return '';
  }

  // Icons.
  let icons = '';
  for (let objType in ICONS) {
    if (!entity.getObject3D(objType)) {
      continue;
    }
    icons += `&nbsp;<i class="fa ${ICONS[objType]}" title="${objType}"></i>`;
  }

  // Name.
  let entityName = entity.id;
  let type = 'id';
  if (!entity.isScene && !entityName && entity.getAttribute('class')) {
    entityName = entity.getAttribute('class').split(' ')[0];
    type = 'class';
  } else if (!entity.isScene && !entityName && entity.getAttribute('mixin')) {
    entityName = entity.getAttribute('mixin').split(' ')[0];
    type = 'mixin';
  }

  return (
    <span className="entityPrint" onDoubleClick={onDoubleClick}>
      <span className="entityTagName">
        {'<' + entity.tagName.toLowerCase()}
      </span>
      {entityName && (
        <span className="entityName" data-entity-name-type={type}>
          &nbsp;{entityName}
        </span>
      )}
      {!!icons && (
        <span
          className="entityIcons"
          dangerouslySetInnerHTML={{ __html: icons }}
        />
      )}
      <span className="entityCloseTag">{'>'}</span>
    </span>
  );
}