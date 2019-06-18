<template>
  <div v-if="data">
    <div class="root-editor__buttons">
      <button @click="preview" class="root-editor__button root-editor__button--update">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#refresh-cw"/>
        </svg>
        <span class="root-editor__button__text">Update Preview</span>
      </button>
      <button @click="save" class="root-editor__button root-editor__button--save">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#save"/>
        </svg>
        <span class="root-editor__button__text">Save state</span>
      </button>
    </div>
    <json-data-property :item="data" :depth="1" :path="initialPath">
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
      return this.$store.state.data.root;
    },
    refs() {
      return this.$store.state.data.refs;
    },
    returnData() {
      return {
        path: this.$store.getters["state/previewUrlToDataPath"],
        root: this.data,
        refs: this.refs,
        wsId: this.$store.state.ws.id
      };
    }
  },
  mounted: function() {
    this.$store.dispatch("data/load");
  },
  methods: {
    preview: function() {
      axios.post("http://localhost:3000/api/preview", this.returnData);
    },
    save: function() {
      axios.post("http://localhost:3000/api/save", this.returnData);
    },
    updated: function() {
      this.$store.dispatch("data/saveRoot", this.data);
    }
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500)
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.root-editor {

  &__buttons {
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
