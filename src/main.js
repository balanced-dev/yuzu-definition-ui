import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");

Vue.component('JsonDataProperty', require('./components/JsonDataEditor/PropertyEditor.vue').default);
Vue.component('JsonDataCollapsibleProperty', require('./components/JsonDataEditor/CollapsiblePropertyEditor.vue').default);
Vue.component('JsonDataBlockType', require('./components/JsonDataEditor/BlockTypeEditor.vue').default);

