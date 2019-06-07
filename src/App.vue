<template>
  <div id="app">
    <tabs></tabs>
  </div>
</template>

<script>
import axios from "axios";
import bootstrap from "./bootstrap";
import Tabs from "./components/Tabs.vue";

export default {
  name: "yuzu-def-ui",
  mounted() {
    axios.get("/_templates/templates.json").then(response => {
      this.$store.commit("loadItems", response.data);
      var route = bootstrap.getRoute();
      bootstrap.findCurrentBlockAndState(response.data, route, this.$store);
      console.log(route);
    });
  },
  components: {
    Tabs
  }
};
</script>

<style lang="scss">
  @import './scss/main.scss';
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100vh;
  }
  .feather-sprite {
    @include u-visually-hide;
  }
  .feather {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>
