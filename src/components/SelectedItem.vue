<template>
  <div v-if="item">
    <h2>{{ item.name }}</h2>
    <ul>
      <li v-for="(value, propertyname) in item.value" v-bind:key="propertyname">
        <a target="_top" :href="href(value)">{{ propertyname }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "selected-item",
  computed: {
    item() {
      return this.$store.state.selectedItem;
    }
  },
  methods: {
    href: value => {
      return "/_templates/html/" + value;
    }
  }
};
</script>

<style scoped lang="scss"></style>
