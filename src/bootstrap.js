import _ from "lodash";
import path from "path";

const findRefForPath = (store, currentPath) => {
  var maps = store.state.blockData.map;
  var blockType = "";
  Object.keys(maps).forEach((block) => {
    var instances = maps[block].instances;
    for(let instance of instances) {
      if(currentPath == instance.path) {
        blockType = instance.state;
      }
    }
  });
  return blockType;
}

const getBlockAndState = (items, state, output, parent) => {
  Object.keys(items).forEach((key) => {
    var item = items[key];
    if (!_.isPlainObject(item) && !_.isArray(item)) {
      if (key === state) {
        output.block = {
          name: parent,
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

const convertPreviewToDataPath = function(strPath)
{
  var arrPath = strPath.split(path.sep);
  var lastIndex = arrPath.length - 1; 
  arrPath[lastIndex] = arrPath[lastIndex].replace(".html", ".json");
  arrPath.splice(lastIndex, 0, "data");
  return arrPath.join(path.sep);
}

const getRoute = () => {
  var url = window.parent.location.pathname;
  var filename = url.substring(url.lastIndexOf("/") + 1);
  return filename.substring(0, filename.lastIndexOf("."));
};

export default {
  convertPreviewToDataPath,
  findRefForPath,
  getBlockAndState,
  getRoute
}