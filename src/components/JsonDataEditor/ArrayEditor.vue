<template>
  <div>
    <label @click="toggleActive">+ {{ label }}</label>
    <div v-if="active" class="array">
      <draggable :list="items" ghost-class="ghost" handle=".handle" @start="drag=true" @end="drag=false">
        <div v-for="(item, index) in items" v-bind:key="index" class="arrayItem">
          <json-data-property
            :item="item"
            :depth="depth + 1"
            :collapsed="true"
            :isArrayItem="true"
            :arrayIndex="index + 1"
          ></json-data-property>
          <a class="handle">sort</a>&nbsp;
          <a @click="deleteItem(item)">delete</a>
        </div>
      </draggable>
      <a @click="addItem">add item</a>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
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
    },
    deleteItem(item) {
      var index = this.$props.items.indexOf(item);
      if (index !== -1) this.$props.items.splice(index, 1);
    },
    addItem() {
      this.$props.items.push({ href:"", title:"" });
    }
  },
  props: ["label", "items", "depth"],
  components: {
    draggable,
  }
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
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
