import api from "../../api";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    data: [],
    areLoading: []
  },
  mutations: {
    load: function(state, payload) {
      state.data.push(payload);
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
      var is = _.some(state.data, (item) => { return item.block == block; });
      if(is) return true;
      var isLoading = _.some(state.areLoading, (i) => { return i == block; });
      return isLoading;
    },
    has: (state) => (block, area, path, ofType) => {
      path = bootstrap.addPrefix(path);
      
      if(ofType) {
        var hasOfType = _.some(state.data, (i) => { 
          return i.block == block && i.data[ofType] && i.data[ofType][area].hasOwnProperty(path); 
        });
        if(hasOfType) return true;
      }

      return _.some(state.data, (i) => { 
        return i.block == block && i.data[area] && i.data[area].hasOwnProperty(path); 
      });
    },
    get: (state) => (block, area, path, ofType) => {

      var block = _.find(state.data, (item) => { return item.block == block; });
      if(block) {
        if(ofType && block.data[ofType]) {
          return block.data[ofType][area]["/"+ path];
        }
        else if(block.data[area]) {
          return block.data[area]["/"+ path];
        }
      }
      else
        return [];
    },
    getOfType: (state, getters) => (p) => {
      var path = getters.get(p.block, 'refs', p.path);
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
          context.commit("load", { block: block, data: response.data });
          context.commit("removeIsLoading", block);
        });
      }
    }
  }
};
