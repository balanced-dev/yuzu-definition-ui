<template>
    <label class="text-editor">
      <input class="text-editor__control text-editor__control--text" v-if="!this.isTextArea" v-on:blur="evaluateLength(item[label])" type="text" v-model="item[label]" />
      <textarea class="text-editor__control text-editor__control--textarea" v-if="this.isTextArea" v-on:blur="evaluateLength(item[label])" v-model="item[label]"></textarea>
      <span class="text-editor__label">
        {{ label }}
      </span>
      <svg class="text-editor__icon feather">
        <use xlink:href="#edit-2"/>
      </svg>
    </label>
</template>

<script>
export default {
  name: "json-data-text",
  data() {
    return {
      isTextArea: this.evaluateLength(this.item[this.label])
    };
  },
  methods: {
    evaluateLength(value) {
      return this.isTextArea = value.length >= 30;
    }
  },
  props: ["label", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.text-editor {
  $this: &;

  display: flex;
  flex-wrap: wrap;
  margin-bottom: $json-data-editor__v-spacing;
  margin-top: $json-data-editor__v-spacing;
  position: relative;

  &:hover:not(:focus-within) {
    #{$this}__icon {
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
      line-height: 1;
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

      ~ #{$this}__label {
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
    top: 0;
    width: size(24px);
  }
  
}
</style>
