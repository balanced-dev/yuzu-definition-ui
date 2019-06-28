<template>
  <div class="tree-menu">
    <label class="tree-menu__search">
      <input class="tree-menu__search__control" :class="{'is-dirty': searchTerm.length > 0}" type="search" v-model="searchTerm" placeholder="Search blocks/pages"/>
      <span class="tree-menu__search__label">Search blocks/pages</span>
      <svg class="tree-menu__search__icon feather">
        <use xlink:href="#search"></use>
      </svg>
    </label>
    <template v-if="searchTerm.length > 0">
      <p class="tree-menu__search-message">
        <template v-if="this.filteredItemsLength > 0">
          Showing results for <span class="tree-menu__search-message__term">"{{searchTerm}}"</span>
        </template>
        <template v-else>
          No blocks/pages found
        </template>
      </p>
    </template>
    <ul class="tree-menu__list" v-for="(value, propertyname, index) in items" v-bind:key="propertyname">
      <tree-menu-item
        :value="value"
        :propertyname="propertyname"
        :index="index"
        :depth="0"
        :class="'tree-menu-item--root'"
      ></tree-menu-item>
    </ul>
  </div>
</template>

<script>
import TreeMenuItem from "./TreeMenuItem.vue";

export default {
  name: "tree-menu",
  data: function() {
    return {
      searchTerm: ""
    }
  },
  computed: {    
    items() {
      return this.searchTerm.length > 0 ? this.filteredItems : this.unfilteredItems;
    },
    unfilteredItems() {
      return this.sortObject(this.$store.state.blocks.items);
    },
    filteredItems() {
      return this.filterItems(this.unfilteredItems);
    },
    filteredItemsLength() {
      return Object.keys(this.filteredItems).length;
    }
  },
  methods: {
    // http://whitfin.io/sorting-object-recursively-node-jsjavascript/
    sortObject(object){
      var sortedObj = {},
          keys = Object.keys(object);

      keys.sort(function(key1, key2){
        key1 = key1.toLowerCase(), key2 = key2.toLowerCase();
        if(key1 < key2) return -1;
        if(key1 > key2) return 1;
        return 0;
      });

      for(var index in keys){
        var key = keys[index];
        if(typeof object[key] == 'object' && !(object[key] instanceof Array)){
          sortedObj[key] = this.sortObject(object[key]);
        } else {
          sortedObj[key] = object[key];
        }
      }
      return sortedObj;
    },
    filterItems(obj) {
      var filteredObj = {},
        keys = Object.keys(obj);

      for(var index in keys){
        var key = keys[index],
            value = obj[key],
            firstChildProperty = Object.keys(value)[0];

        // Include folders only if they contain results
        if(Object.prototype.toString.call(value[firstChildProperty]) === "[object Object]") {
          var filteredSubObj = this.filterItems(value);

          if(Object.keys(filteredSubObj).length > 0) {
            filteredObj[key] = filteredSubObj;
          }
        }
        // If not folder, filter on search term
        else if(key.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          filteredObj[key] = value;
        }
      }
      return filteredObj;
    }
  },
  components: {
    TreeMenuItem
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main';
$tree-menu__search-icon-total-size: size(52px);
$tree-menu__search-icon-symbol-size: size(16px);

@mixin tree-menu__active-icon-styles {
  background-color: $colour-grey-darker;
  border-color: $colour-grey-darker;
}

.tree-menu {
  $this: &;

  &__title {}

  &__list {
    @include u-reset-list;
    width: 100%;
  }

  &__search {
    @include form-input($includeFocusBackdrop: false);
    margin-bottom: $column-gutter-default;
    position: relative;
    width: auto;

    &__label {
      @include u-visually-hide;
      width: 100%;
    }

    &__control {
      flex: 0;
      margin-right: auto;
      margin-left: $tree-menu__search-icon-total-size;
      opacity: 0;
      transition: all 0.2s ease;

      &:focus, &.is-dirty {
        flex: 1;
        opacity: 1;
        transform: translateX(0);

        ~ #{$this}__search__icon {
          @include tree-menu__active-icon-styles;
        }
      }
    }

    &__icon {
      background-color: transparent;
      border: 1px solid $colour-grey-mid-light;
      display: block;
      height: $tree-menu__search-icon-total-size;
      padding: 0 ($tree-menu__search-icon-total-size - $tree-menu__search-icon-symbol-size) / 2;
      position: absolute;
      left: 0; 
      top: 0;
      transition: all 0.2s ease;
      width: $tree-menu__search-icon-total-size;
      z-index: 2;

      &:hover {
        @include tree-menu__active-icon-styles;
      }
    }

    + * {
      clear: both;
    }
  }

  &__search-message {
    @include bold-font;
    @include column-gutters;
    margin-bottom: $column-gutter-default;
    text-transform: uppercase;

    &__term {
      text-transform: none;
    }
  }
}
</style>
