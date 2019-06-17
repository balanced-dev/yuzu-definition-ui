<template>
  <div id="app" class="app" :class="{'nav-is-open': open}">
    <button class="app__toggle" @click="toggleNav">
      <div class="app__toggle__icon__wrapper">
        <svg class="app__toggle__icon feather">
          <use xlink:href="#menu"/>
        </svg>
      </div>
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

import Tabs from "./components/Tabs.vue";

export default {
  name: "yuzu-def-ui",
  data() {
    return {
      open: true
    };
  },
  mounted() {
    this.$store.dispatch("blocks/load");
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
  $app__toggle-button-padding: $column-gutter-default / 2;
  $app__toggle-button-icon-size: size(16px);

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
      cursor: pointer;
      display: flex;      
      left: 100%;
      position: absolute;
      top: 50%;

      &__icon__wrapper,
      &__text {
        background-color: $colour-green;
      }

      &__icon {
        display: block;
        height: $app__toggle-button-icon-size;
        position: relative;
        stroke-width: 3;
        width: $app__toggle-button-icon-size;    
        
        &__wrapper {
          padding: $app__toggle-button-padding;
        }
      }

      &__text {
        display: block;
        flex: 0;
        min-width: 0;
        overflow: hidden;
        transition: flex 0.3s ease;
        padding: $app__toggle-button-padding 0;
        white-space: nowrap;

        &::after {
          content: '';
          display: inline-block;
          width: $app__toggle-button-padding;
        }
      }

      #{$app__nav-open-selector} & {
        display: none;
      }  

      &:hover {
        #{$this}__toggle {
          &__text {
            flex: 1;
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
