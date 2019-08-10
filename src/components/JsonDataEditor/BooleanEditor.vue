<template>
  <label class="boolean-editor">
    <input class="boolean-editor__control" type="checkbox" v-model="item[label]" />
    <span class="boolean-editor__label">
      {{ label }}
    </span>
    <span class="boolean-editor__faux">
      <svg class="boolean-editor__faux__icon feather">
        <use xlink:href="#check"/>
      </svg>
    </span>
  </label>
</template>

<script>
export default {
  name: "json-data-boolean",
  data() {
    return {
    };
  },
  methods: {
  },
  props: ["label", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.boolean-editor {
  $this: &;

  align-items: center;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: $json-data-editor__v-spacing;
  // margin-top: $json-data-editor__v-spacing;

  &:hover {
    cursor: pointer;
  }

  &__control {
    @include u-visually-hide;

    &:checked ~ #{$this}__faux #{$this}__faux__icon {
      display: block;
    }
  }

  &__label {
    @include font-size($font-size-small);
    @include default-font;
    color: $colour-text-default;
    display: block;
    order: 2;
  }  

  &__faux {
    align-items: center;
    background-color: $colour-grey-light;
    border: 1px solid $colour-grey-mid-dark;
    display: flex;
    height: 1.5em;
    justify-items: center;
    margin-right: size(5px);
    order: 1;
    width: 1.5em;

    &__icon {
      color: $colour-text-default;
      display: none;
      max-height: 80%;
      max-width: 100%;
    }
  }
}
</style>
