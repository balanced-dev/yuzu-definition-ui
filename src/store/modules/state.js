export default {
  namespaced: true,
  state: {
    current: {}
  },
  mutations: {
    setCurrent: function(state, current) {
      state.current = current;
    }
  }
};
