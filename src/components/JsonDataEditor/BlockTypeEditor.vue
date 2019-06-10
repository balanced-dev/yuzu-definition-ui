<template>
  <div class="block-type-editor" v-if="type">
    {{type}}
    <select>
      <option v-for="state in states" v-bind:key="state" :value="state.fileName" :selected="state.selected">
        {{ state.name }}
      </option>
    </select>
  </div>
</template>

<script>

const uppercaseFirst = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const stateName = (name, blockName) => {
  var prefix = "par";
  if(name.startsWith(prefix)) 
    blockName = prefix + uppercaseFirst(blockName);

  if(name === blockName)
    return "default";
  else 
    return name.replace(blockName +"_", "");
}

import bootstrap from "../../bootstrap";
export default {
  name: "json-data-block-type",
  data() {
    return {
      type: "",
      states: []
    };
  },
  mounted() {
    var block = bootstrap.findRefForPath(this.$store, this.$props.path);
    var context = {};
    bootstrap.getBlockAndState(this.$store.state.items, block, context);

    var that = this;
    var blockName = context.block.name;
    this.$data.type = blockName;
    Object.keys(context.block.states).forEach((state) => {
      that.$data.states.push({
        name: stateName(state, blockName),
        fileName: state,
        selected: state == context.state.name
      });
    });
  },
  props: ["item", "path"]
};
</script>

<style scoped lang="scss">
.block-type-editor {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
