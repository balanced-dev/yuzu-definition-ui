<template>
  <div class="root-editor" v-if="data">
    <div class="root-editor__buttons">
      <button class="root-editor__button root-editor__button--new" @click="toggleAddStateModal">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#copy"/>
        </svg>
        <span class="root-editor__button__text">Create new</span>
      </button>
      <!-- <button class="root-editor__button root-editor__button--update" @click="preview">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#refresh-cw"/>
        </svg>
        <span class="root-editor__button__text">Update Preview</span>
      </button> -->
      <button class="root-editor__button root-editor__button--save" @click="toggleSaveModal">
        <svg class="root-editor__button__icon feather">
          <use xlink:href="#save"/>
        </svg>
        <span class="root-editor__button__text">Save state</span>
      </button>
      <modal-root-add-state 
        v-if="addStateModal.isOpen" 
        :isValid="addStateModal.isValid"
        :validateFunction="stateNameIsValid"
        :addFunction="addNew"
        :cancelFunction="toggleAddStateModal"
      ></modal-root-add-state>
      <modal-root-save-state 
        v-if="saveModal.isOpen" 
        :saveFunction="save"
        :cancelFunction="toggleSaveModal"
      ></modal-root-save-state>
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
import ModalRootSaveState from "../Modal/ModalRootSaveState";
import ModalRootAddState from "../Modal/ModalRootAddState";

export default {
  name: "json-data-editor",
  data() {
    return {
      initialPath: "",
      updateDisabled: true,
      addStateModal: {
        isOpen: false,
        isValid: false
      },
      saveModal: {
        isOpen: false
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
    toPreview() {
      return this.$store.state.toPreview;
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
    preview: function($index, $event) {
      api.preview(this.returnData);
    },
    toggleAddStateModal() {
      this.addStateModal.isOpen = !this.addStateModal.isOpen;
    },
    toggleSaveModal() {
      this.saveModal.isOpen = !this.saveModal.isOpen;
    },
    save: function() {
      api.save(this.returnData).then(() => {
        window.top.location.href = "/_templates/html/"+ this.currentState.url;
      }); 
      this.toggleSaveModal();
    },
    stateNameIsValid(name) {
      this.addStateModal.isValid = name.length > 0 && this.$store.state.blocks.current.states['/'+ this.block.name +"_"+ name] == undefined;
      return this.addStateModal.isValid;
    },
    addNew(isDuplicate, name) {
      if(this.stateNameIsValid(name)) {
        if(isDuplicate) {
          let data = {...this.returnData};
          let newStateName = this.block.name +"_"+ name;
  
          data.path = bootstrap.buildNewBlockPath(this.currentState.name, newStateName, data.path, ".json");
          data.previewPath = bootstrap.buildNewBlockPath(this.currentState.name, newStateName, data.previewPath, ".html");

          api.save(data).then(() => {
            window.top.location.href = "/_templates/html/"+ data.previewPath;
          });   
        }
        else {
          alert('Functionality needs adding');
        }
                
        this.toggleAddStateModal();
      }
    },
    updated: function() {
      this.$store.dispatch("data/save", this.data);
      api.preview(this.returnData);
    },
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500);
  },
  watch: {
    toPreview: function(val) {
      if(val) {
        this.preview();
        this.$store.commit('resetPreview');
      }
    },
    data: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  },
  components: {
    ModalRootSaveState,
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

    &--new,
    &--update {
      background-color: $colour-blue;
    }

    &--save {
      background-color: $colour-green;
    }
  }
}
</style>
