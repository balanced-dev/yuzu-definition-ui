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
      return this.$store.state.nav.items;
    },
    navContext() {
      return this.$store.state.nav.context;
    }
  },
  methods: {
    icon: (name) => {
      let iconName = '';
      switch (name.toLowerCase()) {
        case "blocks":
          iconName = "box";
          break;      
        case "context":
          iconName = "file-text";
          break;      
        case "data":
          iconName = "code";
          break;      
        default: ""
          break;
      }
      return iconName;
    },
    isInContext: (navContext, state) => {
      return navContext === state;
    },
    setNavContext: function(navContext) {
      this.$store.commit("nav/setCurrent", navContext);
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
$tabs__tab-stack-breakpoint: size(246px, $unit-em);

.tabs {
  &__nav {
    box-shadow: $drop-shadow;
    display: flex;
    height: $app-bar-height;
    left: 0;    
    position: absolute;
    right: 0;
    top: 0;
    
      @include z-index(menu);

    &__item {
      @include column-gutters('padding', ($column-gutter-default / 2));
      align-items: center;
      background-color: $colour-body-bgnd-light-grey;
      color: $colour-text-inactive-light;
      cursor: pointer;
      display: flex;
      flex: 1 1 0%;
      justify-content: center;
      min-width: 0;

      @include respond-upto($tabs__tab-stack-breakpoint) {
        flex-direction: column;
      }

      &__icon {
        display: block;
        flex-shrink: 0;
        height: size(1em);
        width: size(1em);

        @include respond-upto($tabs__tab-stack-breakpoint) {
          margin-bottom: $column-gutter-default / 4;
        }
        @include respond-from($tabs__tab-stack-breakpoint) {
          margin-right: $column-gutter-default / 4;
        }

        &--blocks {
          stroke: $colour-blue;
        }
        &--context {
          stroke: $colour-purple;
        }
        &--data {
          stroke: $colour-lime;
        }
      }

      &__text {
        @include u-ellipsis;
        display: block;
        flex-shrink: 1;
        max-width: 100%;

        @include respond-upto($tabs__tab-stack-breakpoint) {
          line-height: 1;
        }
        @include respond-from($tabs__tab-stack-breakpoint) {
          line-height: $app-bar-height;
        }
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
    margin-top: $app-bar-height;
    max-height: calc(100vh - #{$app-bar-height + $version-number-height});
    overflow-y: auto;
  }
}
</style>
