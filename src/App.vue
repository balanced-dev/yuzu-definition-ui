<template>
  <div id="app" class="app" :class="{'nav-is-open': open}">
    <button class="app__toggle" @click="toggleNav">
      <svg class="app__toggle__icon feather">
        <use xlink:href="#menu"/>
      </svg>
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
      bootstrap.findCurrentBlockAndState(response.data, route, this.$store);
      console.log(route);
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
  @import './scss/main.scss';
  $app__nav-open-selector: '.nav-is-open';
  
  .app {
    $this: &;
    
    @include default-font;
    @include font-size($font-size-small);
    background-color: $colour-grey-dark;
    // font-family: "Avenir", Helvetica, Arial, sans-serif;
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
      display: block;      
      left: 100%;
      position: absolute;
      top: 50%;

      &__icon {
        display: block;
        height: size(24px);
        width: size(24px);

        #{$app__nav-open-selector} & {
          display: none;
        }        
      }
    }

    &__close {
      @include u-reset-button;
      align-items: center;
      background-color: $colour-red;
      display: flex;      
      height: $app-bar-height;
      left: 0;
      position: absolute;
      width: 100%;
      justify-content: center;
      bottom: 0;

      &__icon {
        display: block;
        height: size(24px);
        width: size(24px)
      }
    }
  }

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
</style>
