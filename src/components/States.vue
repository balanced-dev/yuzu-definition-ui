<template>
  <div v-if="block">
    <h2>{{ block.name }}</h2>
    <ul>
      <li
        v-for="(state, propertyname) in block.states"
        v-bind:key="propertyname"
      >
        <a
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
  .active {
    font-weight: bold;
  }
</style>
