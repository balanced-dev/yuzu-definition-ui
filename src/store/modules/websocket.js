const getQsParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default {
  namespaced: true,
  state: {
    id: ""
  },
  mutations: {
    setup: function (state, id) {
      state.id = id;
    }
  },
  actions: {
    setup(context) {
      var url = window.location.search;
      var id = getQsParameterByName("wsId", url);
      if(!id) id = 0;
      context.commit("setup", id);
    }
  }
};
