import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");

Vue.component('JsonDataProperty', require('./components/JsonDataEditor/PropertyEditor.vue').default);

Vue.directive( "sortable", function( value ) {
  var that = this,
      key = this.arg;

  value = value || {};
  value.onUpdate = function( e ) {
    var vm = that.vm,
        array = vm[ key ],
        target = array[ e.oldIndex ];
    array.$remove( target );
    array.splice( e.newIndex, 0, target );
    vm.$emit( "sort", target, e.oldIndex, e.newIndex );
  };
  // TODO: other callbacks...

  Sortable.create( this.el, value );
});
