<template>
  <li class="tree-menu-item">
    <span v-if="isFolder(value)">
      <a class="tree-menu-item__parent" @click="toggleChildren">
        <svg class="tree-menu-item__parent__icon feather" :class="{'is-hidden': showChildren}">
          <use xlink:href="#folder-plus"/>
        </svg>
        <svg class="tree-menu-item__parent__icon feather" :class="{'is-hidden': !showChildren}">
          <use xlink:href="#folder-minus"/>
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
    </span>
    <span v-else>
      <a class="tree-menu-item__child" @click="selectItem(propertyname, value)">{{ propertyname }}</a>
    </span>
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
      this.$store.commit("setNavContext", 'States');
    }
  },
  props: ["value", "propertyname", "index", "depth"]
};
</script>

<style scoped lang="scss">
  @import '../scss/main';

  .tree-menu-item {

    &__parent {
      display: flex;

      &__icon {
        height: 24px;
        width: 24px;

        &.is-hidden {
          display: none;
        }
      }

      &__text {

      }

      &__list {
        @include u-reset-list;
        padding-left: 30px;

        &:not(.is-active) {
          display: none;
        }
      }
    }

    &__child {

    }
  }
</style>
