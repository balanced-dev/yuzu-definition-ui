import _ from "lodash";
import path from "path";

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
  var arrPath = strPath.split("\\");
  var lastIndex = arrPath.length - 1;
  arrPath[lastIndex] = arrPath[lastIndex].replace(".html", ".json");
  arrPath.splice(lastIndex, 0, "data");
  return arrPath.join(path.sep);
}

const getRoute = () => {
  var url = window.parent.location.pathname;
  var filename = url.substring(url.lastIndexOf("/") + 1);
  return filename.substring(0, filename.lastIndexOf("."));
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

export default {
  convertPreviewToDataPath,
  getBlockAndState,
  getRoute,
  addPrefix,
  removePrefix,
  blockFromState,
  defaultFromState,
  buildNewBlockPath,
  getStateSuffix,
  createNewStateName
}