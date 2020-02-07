<template>
  <div id="app" class="app">
    <tabs></tabs>
    <div class="version-number">v1.1.0</div>
  </div>
</template>

<script>

import Tabs from "./components/Tabs.vue";

export default {
  name: "yuzu-def-ui",
  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch("blocks/load");
    this.$store.dispatch("ws/setup");
  },
  methods: {
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
}
.version-number {
  @include column-gutters;
  @include default-font;
  @include font-size($font-size-xsmall);
  background-color: $colour-grey-darker;
  bottom: 0;
  color: $colour-text-default;
  height: $version-number-height;
  left: 0;
  line-height: $version-number-height;
  position: absolute;
  right: 0;
  text-align: right;
}
</style>
