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
      <modal v-if="saveModal.isOpen" @close="toggleSaveModal">
        <template slot="header-text">
          <h2>Confirm save state</h2>                
        </template>
        <template slot="content">
          <p v-if="!saveModal.isAsNew">Do you want to overwrite the current state or save as a new state?</p>
          <p><strong>WARNING:</strong> Any changes within sub-blocks will cause their appropriate state to be overwritten with the content in this current state!</p>
          <template v-if="saveModal.isAsNew">
            <label class="root-editor__text-editor">
              <input class="root-editor__text-editor__control root-editor__text-editor__control--text" type="text" v-model="saveModal.asNewName" placeholder='e.g. "longDescription", "empty"' />
              <span class="root-editor__text-editor__label">New state name</span>
            </label>
          </template>
        </template>
        <template slot="footer">
          <button class="modal__button modal__button--green" v-if="!saveModal.isAsNew" @click="save">Overwrite</button>
          <button class="modal__button modal__button--default" @click="saveNew">Save as new</button>
          <button class="modal__button modal__button--red" @click="toggleSaveModal">Cancel</button>
        </template>
      </modal>
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
import Modal from "../Global/Modal";

export default {
  name: "json-data-editor",
  data() {
    return {
      initialPath: "",
      updateDisabled: true,
      saveModal: {
        isOpen: false,
        isAsNew: false,
        asNewName: ""
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
    currentState() {
      return this.$store.state.state.current;
    },
    returnData() {
      return {
        path: this.$store.getters["state/previewUrlToDataPath"],
        previewPath: this.currentState.url,
        root: this.data,
        refs: this.$store.getters["state/convertToRefs"],
        wsId: this.$store.state.ws.id
      };
    }
  },
  mounted: function() {
    this.$store.dispatch("data/load");
    this.$store.dispatch("blockPaths/load", this.block.name);
    this.$store.dispatch("state/loadAll", this.currentState.name);
  },
  methods: {
    preview: function() {
      api.preview(this.returnData);
    },
    toggleSaveModal() {
      this.saveModal.isOpen = !this.saveModal.isOpen;
      this.saveModal.isAsNew = false;
    },
    save: function() {
      api.save(this.returnData).then(() => {
        window.top.location.href = "/_templates/html/"+ this.currentState.url;
      }); 
      this.toggleSaveModal();
    },
    saveNew() {
      if (this.saveModal.asNewName.length > 0) {
        let data = {...this.returnData};
        let newStateName = this.block.name +"_"+ this.saveModal.asNewName;

        data.path = bootstrap.buildNewBlockPath(this.currentState.name, newStateName, data.path, ".json");
        data.previewPath = bootstrap.buildNewBlockPath(this.currentState.name, newStateName, data.previewPath, ".html");
        
        api.save(data).then(() => {
          window.top.location.href = "/_templates/html/"+ data.previewPath;
        });        
      }
      else {
        this.saveModal.isAsNew = true;
      }
    },
    updated: function() {
      this.$store.dispatch("data/save", this.data);
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
    Modal
  }
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.root-editor {
  padding-bottom: $json-data-editor__v-spacing;
  
  &__text-editor {
    @include form-input;
  }

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
