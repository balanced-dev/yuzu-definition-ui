<template>
  <div class="tree-menu">
    <ul class="tree-menu__list" v-for="(value, propertyname, index) in items" v-bind:key="propertyname">
      <tree-menu-item
        :value="value"
        :propertyname="propertyname"
        :index="index"
        :depth="0"
        :class="'tree-menu-item--root'"
      ></tree-menu-item>
    </ul>
  </div>
</template>

<script>
import TreeMenuItem from "./TreeMenuItem.vue";

export default {
  name: "tree-menu",
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

<style scoped lang="scss">
  @import '../scss/main';
  .tree-menu {
    &__title {
      
    }

    &__list {
      @include u-reset-list;      
    }
  }
</style>
