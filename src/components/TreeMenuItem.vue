<template>
  <li :style="indent">
    <span v-if="isFolder(value)">
      <span @click="toggleChildren">+ {{ propertyname }}</span>

      <span v-if="showChildren">
        <ul v-for="(value, propertyname) in value" v-bind:key="propertyname">
          <tree-menu-item
            :value="value"
            :propertyname="propertyname"
            :index="index"
            :depth="depth + 1"
          ></tree-menu-item>
        </ul>
      </span>
    </span>
    <span v-else>
      <a @click="selectItem(propertyname, value)">{{ propertyname }}</a>
    </span>
  </li>
</template>

<script>
export default {
  name: "tree-menu-item",
  data() {
    return {
      showChildren: false
    };
  },
  methods: {
    isFolder: function(obj) {
      var firstChildProperty = Object.keys(obj)[0];
      return (
        Object.prototype.toString.call(obj[firstChildProperty]) ===
        "[object Object]"
      );
    },
    toggleChildren() {
      this.showChildren = !this.showChildren;
    },
    selectItem(name, value) {
      var item = {
        name: name,
        value: value
      };
      this.$store.commit("selectItem", item);
    }
  },
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 15}px)` };
    }
  },
  props: ["value", "propertyname", "index", "depth"]
};
</script>

<style scoped lang="scss"></style>
