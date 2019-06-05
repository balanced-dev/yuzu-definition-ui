<template>
  <div>
    <ul v-for="(value, propertyname, index) in items" v-bind:key="propertyname">
      <tree-menu-item
        :value="value"
        :propertyname="propertyname"
        :index="index"
        :depth="0"
      ></tree-menu-item>
    </ul>
  </div>
</template>

<script>
import TreeMenuItem from "./TreeMenuItem.vue";
import axios from "axios";

export default {
  name: "tree-menu",
  mounted() {
    axios.get("/_templates/templates.json").then(response => {
      this.$store.commit("loadItems", response.data);
    });
  },
  computed: {
    items() {
      return this.$store.state.items;
    }
  },
  components: {
    TreeMenuItem
  }
};
</script>

<style scoped lang="scss"></style>
