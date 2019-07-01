<template>
  <div class="root-editor" v-if="data">
    <div class="root-editor__buttons">
      <button @click="preview" class="root-editor__button root-editor__button--update">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#refresh-cw"/>
        </svg>
        <span class="root-editor__button__text">Update Preview</span>
      </button>
      <button @click="toggleSaveModal" class="root-editor__button root-editor__button--save">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#save"/>
        </svg>
        <span class="root-editor__button__text">Save state</span>
      </button>
      <modal-root-add-state 
        v-if="saveModal.isOpen" 
        :isAsNew="saveModal.isAsNew"
        :saveFunction="save"
        :saveNewFunction="saveNew"
        :cancelFunction="toggleSaveModal"
      ></modal-root-add-state>
    </div>
    <json-data-property 
      :item="data" 
      :depth="1" 
      :absPath="initialPath"
      :relPath="initialPath"
      :blockName="block.name"
      :class="'property-editor--root'"
    >
    </json-data-property>
  </div>
</template>

<script>
import api from "../../api";
import bootstrap from "../../bootstrap";
import _ from "lodash";
import ModalRootAddState from "../Modal/ModalRootAddState";

export default {
  name: "json-data-editor",
  data() {
    return {
      initialPath: "",
      updateDisabled: true,
      saveModal: {
        isOpen: false,
        isAsNew: false
      }
    };
  },
  computed: {
    data() {
      return this.$store.state.data.root;
    },
    refs() {
      return this.$store.state.data.refs;
    },
    block() {
      return this.$store.state.blocks.current;
    },
    state() {
      return this.$store.state.state.current;
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
      api.preview(this.returnData);
    },
    save: function() {
      api.save(this.returnData);
      this.toggleSaveModal();
    },
    toggleSaveModal() {
      this.saveModal.isOpen = !this.saveModal.isOpen;
      this.saveModal.isAsNew = false;
    },
    saveNew(name) {
      if (name.length > 0) {
        let data = {...this.returnData};
        let newStateName = this.block.name +"_"+ name;
        let newPath = bootstrap.buildNewBlockPath(newStateName, data.path);

        data.path = newPath;        
        api.save(data).then(() => {
          this.redirectToNewState(newStateName);
        });        
      }
      else {
        this.saveModal.isAsNew = true;
      }
    },
    redirectToNewState(newStatename) {
      var filename = bootstrap.removePrefix(this.state.name);
      let newUrl = "/_templates/html/" + this.state.url.replace(filename +".html", newStatename +".html");
      window.top.location.href = newUrl;
    },
    updated: function() {
      this.$store.dispatch("data/saveRoot", this.data);
    },
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500);
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  },
  components: {
    ModalRootAddState
  }
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.root-editor {
  padding-bottom: $json-data-editor__v-spacing;

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
