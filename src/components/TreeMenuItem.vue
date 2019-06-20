<template>
  <li class="tree-menu-item">
    <template v-if="isFolder(value)">
      <a class="tree-menu-item__parent" @click="toggleChildren" :style="{'padding-left': `${depth + 1}rem`}">
        <svg class="tree-menu-item__parent__icon feather" :class="{'is-hidden': !showChildren}">
          <use xlink:href="#minus-square"/>
        </svg>
        <svg class="tree-menu-item__parent__icon feather" :class="{'is-hidden': showChildren}">
          <use xlink:href="#plus-square"/>
        </svg>
        <span class="tree-menu-item__parent__text">
          {{ propertyname }}
        </span>
      </a>
      <ul class="tree-menu-item__parent__list" :class="{'is-active': showChildren}" v-for="(value, propertyname) in value" v-bind:key="propertyname">
        <tree-menu-item
          :value="value"
          :propertyname="propertyname"
          :index="index"
          :depth="depth + 1"
        ></tree-menu-item>
      </ul>
    </template>
    <template v-else>
      <a
       class="tree-menu-item__child" 
        @click="selectItem(propertyname, value)"
        :style="{'padding-left': `${depth + 1}rem`}"
      >
        {{ propertyname }}
      </a>
    </template>
  </li>
</template>

<script>
export default {
  name: "tree-menu-item",
  data() {
    return {
      showChildren: false
    };
  },
  methods: {
    isFolder: function(obj) {
      var firstChildProperty = Object.keys(obj)[0];
      return (
        Object.prototype.toString.call(obj[firstChildProperty]) ===
        "[object Object]"
      );
    },
    toggleChildren() {
      this.showChildren = !this.showChildren;
    },
    selectItem(name, value) {
      var payload = {
        name: name,
        states: value
      };
      this.$store.commit("selectItem", payload);
      this.$store.commit("setNavContext", 'Context');
    }
  },
  props: ["value", "propertyname", "index", "depth"]
};
</script>

<style scoped lang="scss">
  @import '../scss/main';

  @mixin tree-menu-item__list-item {
    padding-bottom: $column-gutter-default / 2;
    padding-top: $column-gutter-default / 2;
    
    &:hover {
      background-color: $colour-grey-mid-dark;
    }
  }

  

  .tree-menu-item {
    $this: &;

    &__parent {
      @include tree-menu-item__list-item;
      @include accordion-button;
      padding-right: $column-gutter-default;
      width: 100%;

      &__icon {

      }

      &__text {
        
      }

      &__list {
        @include u-reset-list;

        &:not(.is-active) {
          display: none;
        }
      }
    }

    &__child {
      @include tree-menu-item__list-item;
      @include u-ellipsis;
      cursor: pointer;
      display: block;
      padding-right: $column-gutter-default;
    }

    &--root {
      > #{$this}__parent {
        @include bold-font;
        background-color: $colour-grey-light;
        margin-bottom: 1px;
        text-transform: uppercase;
      }
    }
  }
</style>
