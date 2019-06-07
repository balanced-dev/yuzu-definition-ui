<template>
  <div class="tabs">
    <nav class="tabs__nav">
      <a
        class="tabs__nav__item"
        v-for="(name) in navItems"
        v-bind:key="name"
        @click="setNavContext(name)"
        :class="{'is-active': isInContext(navContext, name)}"
      >
        {{ name }}
      </a>
    </nav>

    <section class="tabs__section" v-if="navContext === navItems[0]">
      <tree-menu class="test"></tree-menu>
    </section>
    <section class="tabs__section" v-if="navContext === navItems[1]">
      <states></states>
    </section>
    <section class="tabs__section" v-if="navContext === navItems[2]">
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
      return navContext === state;
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

.tabs {
  &__nav {
    display: flex;

    &__item {
      cursor: pointer;
      display: block;
      flex: 1 1 auto;
      text-align: center;

      &.is-active {
        font-weight: bold;
      }
    }
  }  
}
</style>
