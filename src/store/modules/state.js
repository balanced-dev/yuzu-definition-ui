import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    current: {}
  },
  getters: {
    previewUrlToDataPath: state => {
      return bootstrap.convertPreviewToDataPath(state.current.url);
    }
  },
  mutations: {
    setCurrent: function(state, current) {
      state.current = current;
    }
  }
};
