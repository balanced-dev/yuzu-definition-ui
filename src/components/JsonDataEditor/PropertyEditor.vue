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
        <label class="property-editor__property">
          <input class="property-editor__property__control property-editor__property__control--text" v-if="valueLength(key) <= 50" type="text" v-model="item[key]" />
          <textarea class="property-editor__property__control property-editor__property__control--textarea" v-if="valueLength(key) > 50" v-model="item[key]"></textarea>
          <!--  
              TODO: 
              Checkbox for boolean? 
          -->
          <span class="property-editor__property__label">
            {{ key }}
          </span>
          <svg class="property-editor__property__icon feather">
            <use xlink:href="#edit-2"/>
          </svg>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import JsonDataArray from "./ArrayEditor.vue";
import JsonDataObject from "./ObjectEditor.vue";

export default {
  name: "json-data-property",
  methods: {
    isObject: function(item) {
      return _.isPlainObject(item);
    },
    isArray: function(item) {
      return _.isArray(item);
    },
    valueLength(key) {
      return this.$props.item[key].length;
    },
    buildPath(key) {
      return this.$props.path + "/" + key;
    }
  },
  props: ["item", "depth", "path"],
  components: {
    JsonDataArray,
    JsonDataObject
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

$property-editor__property-v-padding: $column-gutter-default / 2;

.property-editor {
  $this: &;

  @include json-data-editor__section($this);

  &__section {    
    position: relative;
    
    &--object {}
    &--array {}
    &--property {}
  }

  &__property {
    display: flex;
    flex-wrap: wrap;
    padding-top: $property-editor__property-v-padding;
    padding-bottom: $property-editor__property-v-padding;
    position: relative;

    &:hover:not(:focus-within) {
      #{$this}__property__icon {
        display: block;
      }
    }

    &__control {
      @include font-size($font-size-small);
      @include default-font;
      background-color: $colour-grey-light;
      border: 1px solid $colour-grey-mid-light;
      color: $colour-white;
      display: block;
      overflow: auto;
      order: 2;
      padding: ($column-gutter-default / 4) ($column-gutter-default / 2);
      width: 100%;

      &--text {
        
      }

      &--textarea {
        height: size(250px);
        overflow: auto;
        resize: none;
      }

      &:hover {
        cursor: pointer;
      }

      &:focus {
        position: relative;
        z-index: 2;

        ~ #{$this}__property__label {
          position: relative;
          z-index: 1;
          &::before {
            display: block;
          }
        }
      }

      &--text {
        
      }

      &--textarea {
        
      }
    }

    &__label {
      display: block;
      order: 1;
      margin-bottom: size(5px);
      width: 100%;

      &::before {
        content: '';
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba($colour-black, 0.6);
        z-index: -1;
      }
    }

    &__icon {
      background-color: $colour-grey-darker;
      color: $colour-blue;
      cursor: pointer;
      display: none;
      height: size(24px);
      padding: $column-gutter-default / 4;
      position: absolute;
      right: 0;
      top: $property-editor__property-v-padding;
      width: size(24px);
    }
  }
}
</style>
