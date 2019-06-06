import _ from "lodash";

const findCurrentBlockAndState = function(items, selectedRoute, store, parent) {
    Object.keys(items).forEach(function(key) {
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
  
  const getRoute = function() {
    var url = window.parent.location.pathname;
    return url.substring(url.lastIndexOf("/") + 1);
  };

  export default {
    findCurrentBlockAndState,
    getRoute
  }