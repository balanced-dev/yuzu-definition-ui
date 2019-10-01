<template>
  <div class="text-editor">
    <template v-if="label">
      <input class="text-editor__control text-editor__control--text" v-if="!this.isTextArea" v-on:blur="evaluateLength(item[label])" type="text" v-model="item[label]" />
      <textarea class="text-editor__control text-editor__control--textarea" v-if="this.isTextArea" v-on:blur="evaluateLength(item[label])" v-model="item[label]"></textarea>
      <span class="text-editor__label">
        {{ label }}
      </span>
    </template>
    <template v-else>
      <input class="text-editor__control text-editor__control--text" type="text" v-model="item[index]" />
    </template>

    <svg class="text-editor__icon feather">
      <use xlink:href="#edit-2"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: "json-data-text",
  data() {
    return {
      isTextArea: false
    }
  },
  mounted() {
    this.evaluateLength();
  },
  methods: {
    evaluateLength() {
      let value = String(this.item[this.label]), 
          charCount = value.length,
          wordCount = value.split(" ").length;
      this.isTextArea = wordCount >= 25 || charCount >= 150;
    }
  },
  props: ["label", "index", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.text-editor {
  $this: &;

  @include form-input;

  // margin-bottom: $json-data-editor__v-spacing;
  // margin-top: $json-data-editor__v-spacing;

  &:hover:not(:focus-within) {
    #{$this}__icon {
      display: block;
    }
  }

  &__control {

    &--text {
      line-height: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--textarea {
      height: size(250px);
      overflow: auto;
      resize: none;
    }
  }

  &__label {
    line-height: 1;
    margin-bottom: size(5px);
    white-space: nowrap;
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
