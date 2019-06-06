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
    });
  },
  components: {
    Tabs
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
