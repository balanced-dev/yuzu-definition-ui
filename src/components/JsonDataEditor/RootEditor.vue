<template>
  <div v-if="data" class="wrapper">
    <json-data-editor-property 
      :item="data"
      :depth="0"
      :isArrayItem="false"
    >
    </json-data-editor-property>
  </div>
</template>

<script>
import axios from "axios";
import JsonDataEditorProperty from "./PropertyEditor.vue";

export default {
  name: "json-data-editor",
  computed: {
    data() {
      return this.$store.state.blockData.data;
    },
    refs() {
      return this.$store.state.blockData.refs;
    }
  },
  mounted: function() {
    if(this.$store.state.selectedItem)
    {
      axios.get("/api/get/content.json").then(response => {
        this.$store.commit("loadBlockData", response.data);
      });
    }
  },
  components: {
    JsonDataEditorProperty
  }
};
</script>

<style scoped lang="scss">
  .wrapper {
    width: 100%;
    height: 90vh;
    overflow-y:scroll;
  }
</style>
