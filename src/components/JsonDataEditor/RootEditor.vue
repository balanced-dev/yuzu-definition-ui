<template>
  <div v-if="data">
    <div class="root-editor__buttons">
      <button :disabled="updateDisabled" @click="update" class="root-editor__button root-editor__button--update">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#refresh-cw"/>
        </svg>
        <span class="root-editor__button__text">Update Preview</span>
      </button>
      <a href="" class="root-editor__button root-editor__button--save">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#save"/>
        </svg>
        <span class="root-editor__button__text">Save state</span>
      </a>
    </div>
    <json-data-property :item="data" :depth="1" :path="initialPath" :class="'property-editor--root'">
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

<style scoped lang="scss">
@import '../../scss/main';

.root-editor {

  &__buttons {
    display: flex;
    justify-content: flex-end;
    padding: $column-gutter-default;
  }

  &__button {
    @include u-reset-button;
    @include font-size($font-size-xsmall);
    @include default-font;
    align-items: center;
    color: $colour-white;
    display: inline-flex;
    line-height: 1;
    padding: $column-gutter-default / 2;
    text-decoration: none;

    &:not(:first-child) {
      margin-left: $column-gutter-default / 2;
    }

    &__icon {
      display: block;
      height: size(16px);
      margin-right: 0.5em;
      width: size(16px);
    }

    &__text {
      @include bold-font;
      text-transform: uppercase;
    }

    &--update {
      background-color: $colour-blue;
    }

    &--save {
      background-color: $colour-green;
    }
  }
}
</style>
