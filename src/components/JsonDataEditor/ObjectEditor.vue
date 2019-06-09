<template>
  <div>
    <label @click="toggleActive">+ {{ label }}</label>
    <div class="object" v-if="active">
      <json-data-property
        :item="item"
        :depth="depth + 1"
        :path="path"
      ></json-data-property>
      <json-data-block-type
        :item="item"
        :path="path"
      ></json-data-block-type>
    </div>
  </div>
</template>

<script>
export default {
  name: "json-data-object",
  data() {
    return {
      active: false
    };
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    }
  },
  props: ["label", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
label {
  display: block;
  font-weight: bold;
  padding-top: 20px;
}
div.object {
  padding-top: 10px;
}
</style>
