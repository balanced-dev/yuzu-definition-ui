import api from "../../api";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    paths: [],
    areLoading: []
  },
  mutations: {
    load: function(state, payload) {
      state.paths.push(payload);
    },
    addIsLoading: function(state, block) {
      state.areLoading.push(block);
    },
    removeIsLoading: function(state, block) {
      _.remove(state.areLoading, (i) => { return i == block });
    },
  },
  getters: {
    hasForBlock: (state) => (block) => {
      var is = _.some(state.paths, (item) => { return item.block == block; });
      if(is) return true;
      var isLoading = _.some(state.areLoading, (i) => { return i == block; });
      return isLoading;
    },
    has: (state) => (block, path, ofType) => {
      path = bootstrap.addPrefix(path);
      if(ofType) {
        return _.some(state.paths, (i) => { 
          return i.block == block && i.paths.hasOwnProperty(ofType) && i.paths[ofType].hasOwnProperty(path); 
        });
      }
      else {
        return _.some(state.paths, (i) => { 
          return i.block == block && i.paths.hasOwnProperty(path); 
        });
      }
    },
    get: (state) => (block, path, ofType) => {

      var d = _.find(state.paths, (item) => { return item.block == block; });
      if(d) {
        if(ofType) {
          return d.paths[ofType]["/"+ path];
        }
        else {
          return d.paths["/"+ path];
        }
      }
      else
        return [];

    },
    getOfType: (state, getters) => (p) => {
      var path = getters.get(p.block, p.path);
      if(path && path.length > 0) {
        var sp = path[0].split('^');
        return sp.length > 1 ? sp[1] : ''; 
      } 
      return '';
    },
  },
  actions: {
    load(context, block) {
      block = bootstrap.removePrefix(block);
      if(!context.getters['hasForBlock'](block)) {
        context.commit("addIsLoading", block);
        api.getRefPaths(block)
        .then(response => {
          context.commit("load", { block: block, paths: response.data });
          context.commit("removeIsLoading", block);
        });
      }
    }
  }
};
