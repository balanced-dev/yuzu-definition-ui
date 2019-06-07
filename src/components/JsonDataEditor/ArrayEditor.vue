<template>
  <div>
    <label @click="toggleActive">+ {{ label }}</label>
    <div v-if="active" class="array" v-sortable:items="{ animation: 200 }">
      <div v-for="(item, index) in items" v-bind:key="index" class="arrayItem" draggable="true">
        <json-data-property
          :item="item"
          :depth="depth + 1"
          :collapsed="true"
          :isArrayItem="true"
          :arrayIndex="index + 1"
        >
        <div>sort</div>
        </json-data-property>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "json-data-array",
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
  props: ["label", "items", "depth"]
};
</script>

<style scoped lang="scss">
label {
  display: block;
  font-weight: bold;
  padding-top: 20px;
}
div.array {
  padding-top: 10px;
}
div.arrayItem {
  margin: 10px 15px;
  padding: 10px 20px;
  border: 1px solid green;
  cursor: pointer;
}
</style>
