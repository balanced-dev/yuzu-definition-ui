<template>
  <div v-if="data" class="wrapper">
    <button @click="saveState">Save State</button>
    <json-data-property :item="data" :depth="0">
    </json-data-property>
  </div>
</template>

<script>
import axios from "axios";

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
    if (this.$store.state.selectedItem) {
      axios.get("/api/get/content.json").then(response => {
        this.$store.commit("loadBlockData", response.data);
      });
    }
  },
  watch: {
    data:{
      deep: true,
      handler: function() {
        this.$store.commit("saveBlockData", this.data);
      }
    }
  },
  methods: {
    saveState: function() {
      //this.$store.commit("saveBlockData", this.$computes);
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 90vh;
  overflow-y: scroll;
}
</style>
