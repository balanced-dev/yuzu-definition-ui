import _ from "lodash";
import bootstrap from "../../bootstrap";

const createDisplayStateName = function(state) {
  if (state == bootstrap.defaultFromState(state)) {
    return "default";
  } else {
    return bootstrap.getStateSuffix(state);
  }
};

export default {
  namespaced: true,
  state: {
    items: []
  },
  mutations: {
    loadStates: function(state, payload) {
      state.items.push(payload);
    },
    addState: function(state, payload) {
      _.each(state.items, function(item) {
        if(item.block === payload.block) {
          item.states.push(payload.state);
        }
      });
    }
  },
  getters: {
    has: (state) => (block) => {
      return _.find(state.items, function(item) {
        return item.block == block; 
      });
    },
    get: (state) => (block) => {
      var d = _.chain(state.items).filter(function(item) {
        return item.block == block; 
      }).first().value();
      if(d)
        return d.states;
      else
        return [];
    }
  },
  actions: {
    loadStates: function(context, data) {
      if(!context.getters.has(data.block)) {
        var states = [];
        var blocksAndState = {};
        bootstrap.getBlockAndState(
          context.rootState.blocks.items,
          data.state,
          blocksAndState
        );
    
        Object.keys(blocksAndState.block.states).forEach(state => {
          states.push({
            name: createDisplayStateName(state),
            value: state
          });
        });
  
        var payload = {
          block: data.block,
          states: states
        };
        context.commit("loadStates", payload);
      }
    },
    addNewState: function(context, payload) {
      var state = {
        name: payload.name,
        value: payload.value
      };
      var payload = {
        block: payload.block,
        state: state
      };
      context.commit("addState", payload);
    },
  }
};
