<template>
  <div class="states" v-if="block">
    <h2 class="states__title">{{ block.name }}</h2>
    <ul class="states__list">
      <li
        class="states__list__item"
        v-for="(state, propertyname) in block.states"
        v-bind:key="propertyname"
      >
        <a
          class="states__list__link"
          target="_top"
          :href="href(state)"
          :class="isSelectedState(currentState, state)"
        >
        {{ propertyname }}</a>
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
      return this.$store.state.selectedBlockState;
    }
  },
  methods: {
    isSelectedState: (currentState, state) => {
      return currentState === state ? 'active': '';
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
      
    }

    &__list {
      @include u-reset-list;
      
      &__item {
  
      }

      &__link {
  
      }
    }
  }
  .active {
    font-weight: bold;
  }
</style>
