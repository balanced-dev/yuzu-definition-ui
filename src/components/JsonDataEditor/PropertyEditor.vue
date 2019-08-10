<template>
  <div class="property-editor" :class="`property-editor--depth-${depth}`">
    <div v-if="isArray(item)" class="property-editor__section property-editor__section--array">
      <json-data-array
        :items="item"
        :depth="depth"
        :absPath="absPath"
        :relPath="relPath"
        :blockName="blockName"
      ></json-data-array>
    </div>
    <div v-else v-for="key in Object.keys(item)" v-bind:key="key">
      <template v-if="!toIgnore(key)">
      <div v-if="isObject(item[key])" class="property-editor__section property-editor__section--object">
        <json-data-object
          :label="key"
          :item="item[key]"
          :depth="depth"
          :absPath="buildPathAbs(key, absPath)"
          :relPath="buildPathRel(key, relPath)"
          :parentState="parentState"
          :blockName="blockName"
          :ofType="ofType"
        ></json-data-object>
      </div>
      <div v-else-if="isArray(item[key])" class="property-editor__section property-editor__section--array">
        <json-data-array
          :label="key"
          :items="item[key]"
          :depth="depth"
          :absPath="buildPathAbs(key, absPath)"
          :relPath="buildPathRel(key, relPath)"
          :blockName="blockName"
          :ofType="ofType"
        ></json-data-array>
      </div>
      <div v-else-if="isBoolean(item[key])" class="property-editor__section property-editor__section--boolean" :style="{'padding-left': `${depth}rem`}">
        <json-data-boolean
          :label="key"
          :item="item"
          :depth="depth"
          :absPath="buildPathAbs(key, absPath)"
          :relPath="buildPathRel(key, relPath)"
        ></json-data-boolean>
      </div>
      <div v-else class="property-editor__section property-editor__section--property" :style="{'padding-left': `${depth}rem`}">
        <json-data-text
          :label="key"
          :item="item"
          :depth="depth"
          :absPath="buildPathAbs(key, absPath)"
          :relPath="buildPathRel(key, relPath)"
        ></json-data-text>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import JsonDataArray from "./ArrayEditor.vue";
import JsonDataBoolean from "./BooleanEditor.vue";
import JsonDataText from "./TextEditor.vue";

export default {
  name: "json-data-property",
  data() {
    return {
      ignoreProperties: ['_ref']
    };
  },
  methods: {
    isObject: function(item) {
      return _.isPlainObject(item);
    },
    isArray: function(item) {
      return _.isArray(item);
    },
    isBoolean: function(item) {
      return _.isBoolean(item);
    },
    toIgnore: function(key) {
      return _.includes(this.ignoreProperties, key);
    },
    buildPathAbs(key, path) {
        return path + "/" + key; 
    },
    buildPathRel(key, path) {
      if(path) {
        return path + "/" + key; 
      }
      else {
        return key;
      }
    }
  },
  props: ["item", "depth", "absPath", "relPath", "blockName", "parentState", "ofType"],
  components: {
    JsonDataArray,
    JsonDataBoolean,
    JsonDataText
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.property-editor {
  $this: &;

  @include json-data-editor__section($this);
  padding-top: $json-data-editor__v-spacing;
  overflow: hidden;

  &--root {
    padding-top: 0;

    > div > #{$this}__section--property {
      margin-bottom: $json-data-editor__v-spacing;
    }
  }

  &:not(&--root){
    #{$this}__section {
      margin-bottom: $json-data-editor__v-spacing;
    }
  }

  &__section {
    position: relative;
    
    &--object {}
    &--array {}

    &--property {
      @include column-gutter('padding', 'right');
    }
  }
}
</style>
