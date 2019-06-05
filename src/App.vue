<template>
  <div id="app">
    <tree-menu></tree-menu>
    <selected-item></selected-item>
  </div>
</template>

<script>
import TreeMenu from "./components/TreeMenu.vue";
import SelectedItem from "./components/SelectedItem.vue";

export default {
  name: "yuzu-def-ui",
  components: {
    TreeMenu,
    SelectedItem
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
