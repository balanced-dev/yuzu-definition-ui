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
    <json-data-property :item="data" :depth="1" :path="initialPath" :class="'property-editor--root'">
    </json-data-property>
  </div>
</template>

<script>
import axios from "axios";
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
      this.toggleSaveModal();
    },
    updated: function() {
      this.$store.dispatch("data/saveRoot", this.data);
    },
    toggleSaveModal() {
      this.saveModal.isOpen = !this.saveModal.isOpen;
      this.saveModal.isAsNew = false;
    },
    saveNew() {
      if (this.saveModal.asNewName.length > 0) {
        let data = {...this.returnData},
            newPath = this.generateNewPath(data.path, this.saveModal.asNewName);

        data.path = newPath.path;        
        axios.post("http://localhost:3000/api/save", data).then(() => {
          this.redirectToNewState(newPath.name);
        });        
      }
      else {
        this.saveModal.isAsNew = true;
      }
    },
    generateNewPath(pathString, newState) {
      let pathArr = pathString.split("/"),
          fileSection = pathArr.pop(),
          extension = fileSection.substring(fileSection.lastIndexOf(".")),
          blockName = fileSection.substring(0, fileSection.lastIndexOf("."));

      blockName =
        blockName.indexOf("_") > -1
          ? blockName.substring(0, blockName.indexOf("_"))
          : blockName;

      let newPathArr = [...pathArr],
          newBlockName = blockName + "_" + newState;

      newPathArr.push(newBlockName + extension);

      return {
        path: newPathArr.join("/"),
        name: newBlockName
      };
    },
    redirectToNewState(stateName) {
      let urlArr = window.top.location.href.split("/"),
          fileSection = urlArr.pop(),
          extension = fileSection.substring(fileSection.lastIndexOf(".")),
          newUrlArr = [...urlArr];

      newUrlArr.push(stateName + extension);
      window.top.location.href = newUrlArr.join("/");
    }
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
