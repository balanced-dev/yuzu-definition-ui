<template>
  <div class="states" v-if="block">
    <h2 class="states__title">{{ block.name }}</h2>
    <ul class="states__list">
      <li
        class="states__list__item"
        v-for="(url, name) in block.states"
        v-bind:key="name"
      >
        <a
          class="states__list__link"
          target="_top"
          :href="href(url)"
          :class="{'is-active': isSelectedState(currentState, name)}"
        >
        {{ name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "states",
  computed: {
    block() {
      return this.$store.state.selectedItem;
    },
    currentState() {
      return this.$store.state.selectedBlockState.name;
    }
  },
  methods: {
    isSelectedState: (currentState, state) => {
      return currentState === state;
    },
    href: state => {
      return "/_templates/html/" + state;
    }
  }
};
</script>

<style scoped lang="scss">
  @import '../scss/main';

  .states {
    
    &__title {
      @include column-gutters;
      @include bold-font;
      @include font-size($font-size-medium);
      background-color: $colour-grey-light;
      padding-bottom: $json-data-editor__v-spacing;
      padding-top: $json-data-editor__v-spacing;
      text-transform: uppercase;
    }

    &__list {
      @include u-reset-list;
      
      &__item {
        
      }

      &__link {
        @include column-gutters;  
        color: inherit;
        display: block;
        padding-bottom: $json-data-editor__v-spacing;
        padding-top: $json-data-editor__v-spacing;
        text-decoration: none;

        &:hover {
          background-color: $colour-grey-mid-dark;
        }
        
        &.is-active {
          @include bold-font;
          background-color: $colour-grey-mid-light;
        }
      }
    }
  }
</style>
