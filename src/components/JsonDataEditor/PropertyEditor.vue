<template>
  <div class="property-editor" :class="`property-editor--depth-${depth}`">
    <div v-for="key in Object.keys(item)" v-bind:key="key">
      <div v-if="isObject(item[key])" class="property-editor__section property-editor__section--object">
        <json-data-object
          :label="key"
          :item="item[key]"
          :depth="depth"
          :path="buildPath(key)"
        ></json-data-object>
      </div>
      <div v-else-if="isArray(item[key])" class="property-editor__section property-editor__section--array">
        <json-data-array
          :label="key"
          :items="item[key]"
          :depth="depth"
          :path="buildPath(key)"
        ></json-data-array>
      </div>
      <div v-else class="property-editor__section property-editor__section--property" :style="{'padding-left': `${depth}rem`}">
        <json-data-text
          :label="key"
          :item="item"
          :depth="depth"
          :path="buildPath(key)"
        ></json-data-text>
      </div>
      <!--  
          TODO: 
          Checkbox for boolean? 
      -->
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import JsonDataArray from "./ArrayEditor.vue";
import JsonDataText from "./TextEditor.vue";

export default {
  name: "json-data-property",
  methods: {
    isObject: function(item) {
      return _.isPlainObject(item);
    },
    isArray: function(item) {
      return _.isArray(item);
    },
    buildPath(key) {
      return this.$props.path + "/" + key;
    }
  },
  props: ["item", "depth", "path"],
  components: {
    JsonDataArray,
    JsonDataText
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.property-editor {
  $this: &;

  @include json-data-editor__section($this);

  &--root {
    > div > #{$this}__section {
      padding-bottom: 0;
      padding-top: 0;
      overflow: hidden;

      &--property {
        @include column-gutter('padding', 'right');
      }
    }
  }

  &__section {
    position: relative;

    &--object,
    &--array {
      background-color: $colour-grey-mid-dark;
      padding-bottom: $json-data-editor__v-spacing;
      padding-top: $json-data-editor__v-spacing;
    }
    
    &--object {}
    &--array {}

    &--property {
      margin-bottom: $json-data-editor__v-spacing;
      margin-top: $json-data-editor__v-spacing;
    }
  }
}
</style>
