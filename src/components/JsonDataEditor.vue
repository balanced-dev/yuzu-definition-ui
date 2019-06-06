<template>
  <div v-if="data">
    {{ data }}
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
    if(this.$store.state.selectedItem)
    {
      axios.get("/api/get/content.json").then(response => {
        this.$store.commit("loadBlockData", response.data);
      });
    }

  },
  methods: {
    
  }
};
</script>

<style scoped lang="scss"></style>
