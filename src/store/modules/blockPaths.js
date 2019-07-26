import api from "../../api";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    paths: []
  },
  mutations: {
    load: function(state, payload) {
      state.paths.push(payload);
    },
  },
  getters: {
    hasForBlock: (state) => (block) => {
      return _.find(state.paths, function(item) {
        return item.block == block; 
      });
    },
    has: (state) => (block, path) => {
      return _.find(state.paths, function(item) {
        return item.block == block && item.paths.hasOwnProperty(bootstrap.addPrefix(path)); 
      });
    },
    get: (state) => (block, path) => {
      var d = _.chain(state.paths).filter(function(item) {
        return item.block == block; 
      }).first().value();
      if(d)
        return d.paths["/"+ path];
      else
        return [];
    }
  },
  actions: {
    load(context, block) {
      if(!context.getters['hasForBlock'](block)) {
        api.getRefPaths(block)
        .then(response => {
          context.commit("load", { block: block, paths: response.data });
        });
      }
    }
  }
};
