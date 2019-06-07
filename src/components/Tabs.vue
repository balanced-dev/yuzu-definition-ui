<template>
  <div>
    <nav>
      <a
        v-for="(name) in navItems"
        v-bind:key="name"
        @click="setNavContext(name)"
        :class="isInContext(navContext, name)"
      >
        {{ name }}
      </a>
    </nav>

    <section v-if="navContext === navItems[0]">
      <tree-menu></tree-menu>
    </section>
    <section v-if="navContext === navItems[1]">
      <states></states>
    </section>
    <section v-if="navContext === navItems[2]">
      <json-data-editor></json-data-editor>
    </section>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import States from "./States.vue";
import JsonDataEditor from "./JsonDataEditor/RootEditor.vue";

export default {
  name: "tabs",
  computed: {
    navItems() {
      return this.$store.state.navItems;
    },
    navContext() {
      return this.$store.state.navContext;
    }
  },
  methods: {
    isInContext: (navContext, state) => {
      return navContext === state ? 'active': '';
    },
    setNavContext: function(navContext) {
      this.$store.commit("setNavContext", navContext);
    }
  },
  components: {
    TreeMenu,
    States,
    JsonDataEditor
  }
};
</script>

<style scoped lang="scss">
.active {
  font-weight: bold;
}
a {
  cursor: pointer;
}
</style>
