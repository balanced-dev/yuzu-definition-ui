<template>
  <div class="array-editor is-active" :class="`array-editor--depth-${depth}`">
    <div v-if="label" class="array-editor__title" :style="{'padding-left': `${depth}rem`}">
      <svg class="array-editor__title__icon feather">
        <use xlink:href="#folder"/>
      </svg>
      <span class="array-editor__title__text">
        {{ label }}
      </span>
    </div>
    <div class="array-editor__section">
      <draggable
        :list="items"
        ghost-class="ghost"
        handle=".array-editor__item__sort"
        @start="drag = true"
        @end="drag = false"
      >
        <div
          v-for="(item, index) in items"
          v-bind:key="index"
          class="array-editor__item"
        >
          <json-data-object
            v-if="isRef(item)"
            :label="refLabel(item)"
            :item="item"
            :depth="depth+1"
            :absPath="buildPath(index, absPath)"
            :relPath="relPath"
            :isAnyOf="isAnyOf"
          ></json-data-object>
          <json-data-collapsible-property
            v-if="!isRef(item)"
            :label="label"
            :item="item"
            :depth="depth + 1"
            :absPath="buildPath(index, absPath)"
            :relPath="relPath"
            :arrayIndex="index + 1"
            :blockName="blockName"
          ></json-data-collapsible-property>
          <div class="array-editor__item__footer" :style="{'padding-left': `${depth+1}rem`}">
            <a class="array-editor__item__sort">
              <svg class="array-editor__item__sort__icon feather">
                <use xlink:href="#more-vertical"/>
              </svg>
              <span class="array-editor__item__sort__text">
                Sort
              </span>
            </a>            
            <a class="array-editor__item__delete" @click="setToDelete({item: item, path: relPath})">            
              <svg class="array-editor__item__delete__icon feather">
                <use xlink:href="#x-square"/>
              </svg>
              <span class="array-editor__item__delete__text">
                Delete
              </span>
            </a>
          </div>
        </div>
      </draggable>
      <modal-array-editor-delete 
        v-if="toDelete" 
        :item="toDelete"
        :deleteFunction="deleteItem"
        :cancelFunction="resetToBeDeleted"
      ></modal-array-editor-delete>
      <modal-array-editor-add 
        v-if="isAnyOf && addBlockModal.isOpen" 
        :selected="addBlockModal.selected"
        :options="addBlockModal.options"
        :addFunction="addBlockItem"
        :cancelFunction="toggleAddBlockModal"
      ></modal-array-editor-add>
      <div class="array-editor__section__footer" :style="{'margin-left': `${depth+1}rem`}">
        <button class="array-editor__section__add" v-if="!isAnyOf" @click="addItem">
          <svg class="array-editor__section__add__icon feather">
            <use xlink:href="#plus-square"/>
          </svg>
          <span class="array-editor__section__add__text">
            Add item
          </span>        
        </button>
        <button class="array-editor__section__add" v-if="isAnyOf" @click="toggleAddBlockModal">
          <svg class="array-editor__section__add__icon feather">
            <use xlink:href="#plus-square"/>
          </svg>
          <span class="array-editor__section__add__text">
            Add block
          </span>        
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import api from '../../api';
import bootstrap from "../../bootstrap";
import ModalArrayEditorAdd from "../Modal/ModalArrayEditorAdd";
import ModalArrayEditorDelete from "../Modal/ModalArrayEditorDelete";

export default {
  name: "json-data-array",
  data() {
    return {
      toDelete: undefined,
      addBlockModal: {
        isOpen: false,
        options: [],
        selected: ''
      }
    };
  },
  computed: {
    paths() {
      return this.$store.state.data.paths;
    },
    isAnyOf() {
      if(this.$store.getters['blockPaths/has'](this.blockName, this.relPath)) {
        this.addBlockModal.options = this.$store.getters['blockPaths/get'](this.blockName, this.relPath);
        this.addBlockModal.selected = this.addBlockModal.options[0];
        return this.addBlockModal.options.length > 1
      }
      return false;
    }
  },
  methods: {
    isRef(item) {
      return item.hasOwnProperty('$ref');
    },
    refLabel(item) {
      return item["$ref"];
    },
    setToDelete(value) {
      this.toDelete = value;
    },
    resetToBeDeleted(value) {
      this.toDelete = undefined;
    },
    deleteItem() {
      var index = this.$props.items.indexOf(this.toDelete.item);
      if (index !== -1) this.$props.items.splice(index, 1);
      this.resetToBeDeleted();
    },
    buildPath(index, path) {
      return path +"["+ index +"]";
    },
    toggleAddBlockModal() {
      this.addBlockModal.isOpen = !this.addBlockModal.isOpen;
    },
    addItem() {
      var that = this;
      
      api.getEmpty("/"+ this.blockName, this.relPath)
      .then(response => {
        that.$props.items.push(response.data);
      });
    },
    addBlockItem(block) {
      this.addBlockModal.isOpen = false;
      var item = {};
      item['$ref'] = block;
      this.$props.items.push(item);
    }
  },
  props: ["label", "items", "depth", "absPath", "relPath", "blockName"],
  components: {
    draggable,
    ModalArrayEditorAdd,
    ModalArrayEditorDelete
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

@mixin array-editor__button {
  @include bold-font;
  @include font-size($font-size-xsmall);
  align-items: center;
  cursor: pointer;
  color: $colour-white;
  display: inline-flex;
  padding: ($column-gutter-default / 4) ($column-gutter-default / 2);
  text-transform: uppercase;

  &:not(:only-child) {
    margin-left: $column-gutter-default / 2;
  }

  &__icon {
    height: 1em;
    margin-right: size(2px);
    width: 1em;
  }

  &__text {
    line-height: 1;
  }

  &:hover {
    box-shadow: $drop-shadow;
  }
}
.array-editor {
  $this: &;

  @include json-data-editor__section($this);
  
  &__title {
    padding-top: $json-data-editor__v-spacing;
    &__icon {
      //opacity: 0;
    }
  }  

  .object-editor.is-active ~ #{$this}__item__footer {
    display: none;
  }

  &__section {
    padding-top: $json-data-editor__v-spacing;
    
    &__add {
      @include u-reset-button;
      @include array-editor__button;
      background-color: $colour-green;
      color: $colour-body-bgnd-dark-grey;

      &__icon {
      }

      &__text {

      } 
    }

    &__footer {
      border-top: 1px solid $colour-grey-light;
      padding-top: $json-data-editor__v-spacing * 1.5;
      padding-bottom: $json-data-editor__v-spacing;
    }
  }

  &__item {
    margin-bottom: $json-data-editor__v-spacing;
    position: relative;

    &__footer {
      display: flex;
      top: size(2px);
      right: $column-gutter-default;
      position: absolute;
    }

    &__sort {
      @include array-editor__button;
      background-color: $colour-blue;
      cursor: move; /* Fallback if grab cursor is unsupported */
      cursor: grab;

      &:active {
        cursor: grabbing;
      }

      &__icon {
      }

      &__text {

      }      
    }

    &__delete {
      @include array-editor__button;
      background-color: $colour-red;

      &__icon {
      }

      &__text {

      }      
    }

    &.ghost {
      $horizontal-shift: size(5px);

      color: $colour-body-bgnd-dark-grey;
      background-color: $colour-grey-xlight;
      margin-right: -$horizontal-shift;
      padding-bottom: $json-data-editor__v-spacing;
      padding-left: $horizontal-shift;
      padding-right: $column-gutter-default;

      #{$this}__item__footer {
        right: $column-gutter-default;
      }
    }
  }
}
</style>
