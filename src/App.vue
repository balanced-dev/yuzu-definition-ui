<template>
  <div id="app" class="app" :class="{'nav-is-open': open}">
    <button class="app__toggle" @click="toggleNav">
      <svg class="app__toggle__icon feather">
        <use xlink:href="#menu"/>
      </svg>
      <span class="app__toggle__text">Dev Tools</span>
    </button>
    <tabs></tabs>
    <button class="app__close" @click="toggleNav">
      <svg class="app__close__icon feather">
        <use xlink:href="#x"/>
      </svg>
      <span class="app__close__text">Close</span>
    </button>
  </div>
</template>

<script>
import axios from "axios";
import bootstrap from "./bootstrap";
import Tabs from "./components/Tabs.vue";

export default {
  name: "yuzu-def-ui",
  data() {
    return {
      open: true
    };
  },
  mounted() {
    axios.get("/_templates/templates.json").then(response => {
      this.$store.commit("loadItems", response.data);
      var route = bootstrap.getRoute();
      if(!route) route = "content";

      var context = {};
      bootstrap.getBlockAndState(response.data, route, context);
      this.$store.commit("selectItem", context.block);
      this.$store.commit("setBlockState", context.state);
    });
  },
  methods: {
    toggleNav() {
      this.open = !this.open;
    }
  },
  components: {
    Tabs
  }
};
</script>

<style lang="scss">
  @import './scss/generic.scss';
  @import './scss/main.scss';
  $app__nav-open-selector: '.nav-is-open';

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
  
  .app {
    $this: &;
    
    @include default-font;
    @include font-size($font-size-small);
    background-color: $colour-grey-dark;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $colour-text-default;
    min-height: 100vh;    
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: transform ease 0.2s;

    &:not(#{$app__nav-open-selector}) {
      transform: translateX(-100%);
    }

    &#{$app__nav-open-selector} {
      transform: translateX(0);
    }

    &__toggle {
      @include u-reset-button;
      background-color: $colour-green;
      cursor: pointer;
      display: flex;      
      left: 100%;
      padding: $column-gutter-default / 2;
      position: absolute;
      top: 50%;

      &__icon {
        display: block;
        flex-shrink: 0;
        height: size(16px);
        position: relative;
        stroke-width: 3;
        width: size(16px);              
      }

      &__text {
        max-width: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        white-space: nowrap;

        &::before {
          content: '';
          display: inline-block;
          width: size(4px);
        }
      }

      #{$app__nav-open-selector} & {
        display: none;
      }  

      &:hover {
        #{$this}__toggle {
          &__text {
            max-width: size(80px);
          }
        }
      }
    }

    &__close {
      @include u-reset-button;
      align-items: center;
      background-color: $colour-red;
      bottom: 0;
      cursor: pointer;
      display: flex;      
      left: 0;
      height: $app-bar-height;
      justify-content: center;
      outline-offset: -5px;
      position: absolute;
      width: 100%;

      &__icon {
        display: block;
        height: 1.25em;
        width: 1.25em
      }
    }
  }
</style>
