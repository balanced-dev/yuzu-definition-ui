import _ from "lodash";
import path from "path";
import { fdatasync } from "fs";

const getBlockAndState = (items, state, output, parent) => {
  Object.keys(items).forEach((key) => {
    var item = items[key];
    if (!_.isPlainObject(item) && !_.isArray(item)) {
      if (key === addPrefix(state)) {
        output.block = {
          name: removePrefix(Object.keys(items)[0]),
          states: items
        };
        output.state = {
          name: key,
          url: item
        };
      }
    } else if (_.isPlainObject(item)) {
      getBlockAndState(item, state, output, key);
    }
  });
};

const convertPreviewToDataPath = function (strPath) {
  
  const data = getBlockUrlData(strPath);
  return `${data.type}/${data.area}${data.area ? '/' : ''}${data.name}/data/${data.prefix}${data.name}${data.state}.json`;
}

const getRoute = () => {

  const data = getBlockUrlData(window.parent.location.search);
  return data.prefix + data.name + data.state;
}

const addPrefix = function(blockName) {
  var firstChar = blockName.charAt(0);
  if (firstChar != "/") blockName = "/"+ blockName;
  return blockName;
}

const removePrefix = function(blockName) {
  var firstChar = blockName.charAt(0);
  if (firstChar == "/") blockName = blockName.substring(1);
  return blockName;
}

const removeOfType = function (ref) {
  return ref.split('^')[0];
}

const blockFromState = function (state) {
  state = removePrefix(state);
  return state.split('_')[0];
}

const defaultFromState = function (state) {
  return state.split('_')[0];
}

const buildNewBlockPath = function (currentState, newState, path, extension) {
  currentState = removePrefix(currentState);
  return path.replace(currentState + extension, newState + extension);
}

const getStateSuffix = function(state) {
  var defaultState = defaultFromState(state);
  return state.replace(defaultState + "_", "")
}

const createNewStateName = function(state, stateSuffix) {
  var defaultState = defaultFromState(state);
  return defaultState +"_"+ stateSuffix;
}

const getBlockUrlData = function(url)
{
  const urlParams = new URLSearchParams(url);

  var o = {};
  o.type = urlParams.get('type');
  o.area = urlParams.has('area') ? urlParams.get('area') : '';
  o.prefix = o.type == 'blocks' ? 'par' : '';
  o.name = urlParams.get('name');
  o.state = urlParams.has('state') ? '_'+ urlParams.get('state') : '';

  return o;
}

export default {
  convertPreviewToDataPath,
  getBlockAndState,
  getRoute,
  addPrefix,
  removeOfType,
  removePrefix,
  blockFromState,
  defaultFromState,
  buildNewBlockPath,
  getStateSuffix,
  createNewStateName
}