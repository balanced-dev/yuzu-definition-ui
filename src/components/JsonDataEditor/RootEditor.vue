<template>
  <div v-if="data">
    <button :disabled="updateDisabled" @click="update">Update Preview</button>
    <json-data-property :item="data" :depth="0" :path="initialPath">
    </json-data-property>
  </div>
</template>

<script>
import axios from "axios";
import bootstrap from "../../bootstrap";

export default {
  name: "json-data-editor",
  data() {
    return {
      initialPath: "",
      updateDisabled: true
    };
  },
  computed: {
    data() {
      return this.$store.state.blockData.data;
    },
    refs() {
      return this.$store.state.blockData.refs;
    },
    path() {
      return bootstrap.convertPreviewToDataPath(this.$store.state.selectedBlockState.url);
    }
  },
  mounted: function() {
    var currentState = this.$store.state.selectedBlockState.name;
    if (currentState) {
      axios.get("http://localhost:3000/api/getWithRefs/"+ currentState).then(response => {
        this.$store.commit("loadBlockData", response.data);
      });
    }
  },
  methods: {
    update: function() {
      axios.post("http://localhost:3000/api/preview", {
        path: this.path,
        data: this.data
      })
      .then(() => {});
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        this.$store.commit("saveBlockData", this.data);
        this.$data.updateDisabled = false;
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>
