<template>
  <div class="block-type-editor" v-if="subBlock" :class="`block-type-editor--depth-${depth}`">
    <label class="block-type-editor__select">
      <select
        class="block-type-editor__select__control"
        v-model="subBlock.state"
        @change="changeState()"
      >
        <option
          class="block-type-editor__select__control__option"
          v-for="state in states"
          v-bind:key="state.name"
          :value="state.value"
        >{{ state.name }}</option>
      </select>
      <span class="block-type-editor__select__label">{{subBlock.name}}</span>
      <svg class="block-type-editor__select__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#chevron-down"></use>
      </svg>
    </label>
    <a href="" class="block-type-editor__button block-type-editor__button--link">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#link"/>
      </svg>
      <span class="block-type-editor__button__text">Go to block</span>
    </a>
    <!-- <a href="" class="block-type-editor__button block-type-editor__button--save">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#save"/>
      </svg>
      <span class="block-type-editor__button__text">Save state</span>
    </a> -->
  </div>
</template>

<script>
import axios from "axios";
import bootstrap from "../../bootstrap";

export default {
  name: "json-data-block-type",
  data() {
    return {
      active: true,
      states: []
    };
  },
  computed: {
    refs() {
      return this.$store.state.data.refs;
    }
  },
  mounted() {
    var that = this;
    var context = {};

    bootstrap.getBlockAndState(
      this.$store.state.blocks.items,
      this.subBlock.state,
      context
    );

    Object.keys(context.block.states).forEach(state => {
      that.states.push({
        name: this.createDisplayStateName(state),
        value: state
      });
    });
  },
  methods: {
    createDisplayStateName: function(name) {
      if (name === this.subBlock.name) {
        return "default";
      } else {
        return name.replace(this.subBlock.name + "_", "");
      }
    },
    changeState: function() {

      var that = this;
      var state = "/"+ this.subBlock.state;

      if(!this.refs[state]) {
        axios.post("http://localhost:3000/api/get", {
          stateName: this.subBlock.state
        })
        .then(function(response) {
          that.item["$ref"] = state;
          that.subBlock.data = response.data
        });
      }
      else {
        that.item["$ref"] = state;
        that.subBlock.data = this.refs[state];
      }
    }
  },
  props: ["item", "depth", "subBlock"]
};
</script>

<style scoped lang="scss">
@import "../../scss/main";
$block-type-editor__icon-size: size(14px);
$block-type-editor__select-height: size(34px);

.block-type-editor {
  $this: &;

  align-items: center;
  display: flex;
  position: absolute;
  right: $column-gutter-default;
  top: 0;

  &--depth-2 {
    top: size(3px);
  }

  &__button {
    display: block;
    margin-left: ($column-gutter-default / 4);
    padding: ($column-gutter-default / 4);
    position: relative;

    &--link {
      background-color: $colour-blue;
    }
    &--save {
      background-color: $colour-green;
    }
    &--save-as-new {
      background-color: $colour-red;
    }

    &__icon {
      color: $colour-white;
      display: block;
      height: 1.25em;
      width: 1.25em;
    }

    &__text {
      @include font-size($font-size-xsmall);
      box-shadow: $drop-shadow;
      background-color: $colour-grey-darker;
      border: 1px solid transparent;
      color: $colour-text-default;
      display: none;
      line-height: 1;
      right: 0;
      margin-top: size(6px);
      padding: ($column-gutter-default / 4);
      position: absolute;
      top: 100%;
      white-space: nowrap;
      z-index: 1;

      &::before {
        background-color: inherit;
        border-left: inherit;
        border-top: inherit;
        content: "";
        height: $column-gutter-default / 2;
        right: $column-gutter-default / 2;
        position: absolute;
        top: -($column-gutter-default / 4 + size(1px));
        transform: rotate(45deg);
        width: $column-gutter-default / 2;
      }
    }

    &:hover {
      #{$this}__button__text {
        display: block;
      }
    }
  }

  &__select {
    background-color: $colour-grey-darker;
    border: 1px solid $colour-grey-mid-dark;
    height: $block-type-editor__select-height;
    overflow: hidden;
    position: relative;

    &:focus-within {
      #{$this}__select {
        &__control {
          opacity: 1;
        }
        &__label {
          opacity: 0;
          transform: translateY(-100%);
        }
      }
    }

    &__control,
    &__label {
      @include font-size($font-size-small);
      @include default-font;
      align-items: center;
      display: flex;
      height: $block-type-editor__select-height;
      padding: 0 ($column-gutter-default / 2);
      padding-right: ($column-gutter-default / 2)*2 + $block-type-editor__icon-size;
    }

    &__control {
      background-color: transparent;
      border: 0;
      color: $colour-text-default;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s ease;
      width: 100%;

      &:hover,
      &:focus {
        opacity: 1;
        transition: opacity 0.3s ease 0.15s;

        ~ #{$this}__select__label {
          opacity: 0;
          transform: translateY(-100%);
        }
      }

      &__option {
        color: $colour-grey-dark;
      }
    }

    &__label {
      margin-top: -$block-type-editor__select-height;
      opacity: 1;
      pointer-events: none;
      transform: translateY(0);
      transition: all 0.3s ease;
    }

    &__icon {
      pointer-events: none;
      position: absolute;
      right: ($column-gutter-default / 2);
      top: 0;
      display: block;
      height: 100%;
      width: $block-type-editor__icon-size;
    }
  }
}
</style>
