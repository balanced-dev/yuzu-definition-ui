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
        <svg class="tabs__nav__item__icon feather" :class="[`tabs__nav__item__icon--${name.toLowerCase().split(' ').join('-')}`]">
          <use :xlink:href="`#${icon(name)}`"/>
        </svg>
        <span class="tabs__nav__item__text">
          {{ name }}
        </span>
      </a>
    </nav>

    <section class="tabs__section" v-if="navContext === navItems[0]">
      <tree-menu></tree-menu>
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
    icon: (name) => {
      let iconName = '';
      switch (name.toLowerCase()) {
        case 'blocks':
          iconName = 'box';
          break;      
        case 'states':
          iconName = 'file-text';
          break;      
        case 'data':
          iconName = 'code';
          break;      
        default: ''
          break;
      }
      return iconName;
    },
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
@import '../scss/main';
$tabs__nav-height: size(42px);

.tabs {
  &__nav {
    box-shadow: $drop-shadow;
    display: flex;
    height: $app-bar-height;
    left: 0;    
    position: absolute;
    right: 0;
    top: 0;

    &__item {
      @include u-ellipsis;
      @include column-gutters;
      align-items: center;
      background-color: $colour-body-bgnd-light-grey;
      color: $colour-text-inactive-light;
      cursor: pointer;
      display: block;
      flex: 1 1 0;

      &__icon {
        height: size(1em);
        display: inline-block;
        margin-right: $column-gutter-default / 4;
        vertical-align: middle;
        width: size(1em);

        &--blocks {
          stroke: $colour-blue;
        }
        &--states {
          stroke: $colour-purple;
        }
        &--data {
          stroke: $colour-green;
        }
      }

      &__text {
        display: inline-block;
        line-height: $app-bar-height;
        vertical-align: middle;
      }

      &:not(:last-child) {
        border-right: 1px solid $colour-body-bgnd-dark-grey;
      }

      &.is-active {
        background-color: $colour-body-bgnd-dark-grey;
        color: $colour-text-default;
      }
    }
  }
  
  &__section {
    margin-bottom: $app-bar-height;
    margin-top: $app-bar-height;
    max-height: calc(100vh - #{$app-bar-height * 2});
    overflow-y: auto;
  }
}
</style>
