import _ from "lodash";
import { isRegExp } from "util";

const findRefForPath = (store, currentPath) => {
  var maps = store.state.blockData.map;
  var blockType = "";
  Object.keys(maps).forEach((block) => {
    var paths = maps[block].paths;
    for(let path of paths) {
      if(currentPath == path) {
        blockType = block;
      }
    }
  });
  return blockType;
}

const findCurrentBlockAndState = (items, selectedRoute, store, parent) => {
  Object.keys(items).forEach((key) => {
    var item = items[key];
    if (!_.isPlainObject(item) && !_.isArray(item)) {
      if (key === selectedRoute) {
        var payload = {
          name: parent,
          states: items
        };
        store.commit("selectItem", payload);
        store.commit("setBlockState", item);
      }
    } else if (_.isPlainObject(item)) {
      findCurrentBlockAndState(item, selectedRoute, store, key);
    }
  });
};

const getRoute = () => {
  var url = window.parent.location.pathname;
  return url.substring(url.lastIndexOf("/") + 1);
};

export default {
  findRefForPath,
  findCurrentBlockAndState,
  getRoute
}