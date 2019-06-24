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

  @include form-input;

  margin-bottom: $json-data-editor__v-spacing;
  margin-top: $json-data-editor__v-spacing;

  &:hover:not(:focus-within) {
    #{$this}__icon {
      display: block;
    }
  }

  &__control {

    &--text {
      line-height: 1;
    }

    &--textarea {
      height: size(250px);
      overflow: auto;
      resize: none;
    }
  }

  &__label {
    margin-bottom: size(5px);
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