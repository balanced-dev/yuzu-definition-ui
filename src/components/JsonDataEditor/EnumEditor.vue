<template>
  <label class="enum-editor__select">
    <select
        class="enum-editor__select__control"
        v-model="item[label]"
      >
        <option
          class="enum-editor__select__control__option"
          v-for="enumValue in enums"
          v-bind:key="enumValue"
          :value="enumValue"
        >{{ enumValue }}</option>
    </select>
    <span class="enum-editor__select__label">{{ label }}</span>
    <svg class="enum-editor__select__icon feather">
      <use xlink:href="#chevron-down"></use>
    </svg>
  </label>
</template>

<script>
export default {
  name: "json-data-enum",
  data() {
    return {
    };
  },
  computed: {
    enums() {
      return this.$store.getters['schema/get'](this.blockName, 'enums', this.path);
    }
  },
  methods: {
  },
  props: ["label", "item", "depth", "path", "blockName"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.enum-editor {
  $this: &;

  align-items: center;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  &__label {
    @include font-size($font-size-small);
    @include default-font;
    color: $colour-text-default;
    display: block;
  }  

  &__select {
    @include form-select($this: &, $overlayLabel: false, $height: size(43px));
    &__control {

      &__option {

      }
    }

    &__label {

    }

    &__icon {

    }
  }

}
</style>
