<template>
  <div v-if="blockType">
      Block Type: {{blockType}}
  </div>
</template>

<script>
import bootstrap from "../../bootstrap";
export default {
  name: "json-data-block-type",
  computed: {
    blockType() {
      return bootstrap.findRefForPath(this.$store, this.$props.path);
    }
  },
  props: ["item", "path"]
};
</script>

<style scoped lang="scss"></style>
