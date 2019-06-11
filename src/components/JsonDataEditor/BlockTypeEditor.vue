<template>
  <div class="block-type-editor" v-if="type" :class="`block-type-editor--depth-${depth}`">
    <label class="block-type-editor__select">
      <select class="block-type-editor__select__control">
        <option class="block-type-editor__select__control__option" v-for="state in states" v-bind:key="state" :value="state.fileName" :selected="state.selected">
          {{ state.name }}
        </option>
      </select>
      <span class="block-type-editor__select__label">
        {{type}}
      </span>
      <svg class="block-type-editor__select__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#chevron-down"/>
      </svg>
    </label>
  </div>
</template>

<script>

const uppercaseFirst = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const stateName = (name, blockName) => {
  var prefix = "par";
  if(name.startsWith(prefix)) 
    blockName = prefix + uppercaseFirst(blockName);

  if(name === blockName)
    return "default";
  else 
    return name.replace(blockName +"_", "");
}

import bootstrap from "../../bootstrap";
export default {
  name: "json-data-block-type",
  data() {
    return {
      type: "",
      states: []
    };
  },
  mounted() {
    var block = bootstrap.findRefForPath(this.$store, this.$props.path);
    var context = {};
    bootstrap.getBlockAndState(this.$store.state.items, block, context);

    var that = this;
    var blockName = context.block.name;
    this.$data.type = blockName;
    Object.keys(context.block.states).forEach((state) => {
      that.$data.states.push({
        name: stateName(state, blockName),
        fileName: state,
        selected: state == context.state.name
      });
    });
  },
  props: ["item", "path", "depth"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';
$block-type-editor__icon-size: size(14px);

.block-type-editor {
  $this: &;

  position: absolute;
  right: $column-gutter-default;
  top: 0;

  &--depth-1 {
    top: size(3px);
  }

  &__select {
    background-color: $colour-grey-darker;
    border: 1px solid $colour-grey-mid-dark;
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
      @include default-font;
      padding: ($column-gutter-default / 4) ($column-gutter-default / 2);
      padding-right: ($column-gutter-default / 2)*2 + $block-type-editor__icon-size;
    }
    
    &__control {
      background-color: transparent;
      border: 0;
      display: block;
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
      align-items: center;
      bottom: 0;
      display: flex;
      left: 0;
      opacity: 1;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
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
