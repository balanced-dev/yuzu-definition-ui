<template>
  <div class="array-editor" :class="`array-editor--depth-${depth}`">
    <label class="array-editor__title" @click="toggleActive" :style="{'padding-left': `${depth}rem`}">
      <svg class="array-editor__title__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#plus-square"/>
      </svg>
      <svg class="array-editor__title__icon feather" :class="{'is-hidden': !this.active}">
        <use xlink:href="#minus-square"/>
      </svg>
      <span class="array-editor__title__text">
        {{ label }}
      </span>
    </label>
    <div class="array-editor__section" v-if="active">
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
            <a class="array-editor__item__delete" @click="setToDelete({item: item, path: path})">            
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
      <modal v-if="toDelete" @close="resetToBeDeleted();">
        <template slot="header-text">
          <h2>Confirm deletion</h2>                
        </template>
        <template slot="content">
          <p>Are you sure you want to delete this item from "{{toDelete.path}}"?</p>
        </template>
        <template slot="footer">
          <button class="modal__button modal__button--red" @click="deleteItem(toDelete.item);">Delete</button>
          <button class="modal__button modal__button--default" @click="resetToBeDeleted();">Cancel</button>
        </template>
      </modal>
      <modal v-if="addBlockModal.isOpen" @close="toggleAddBlockModal">
        <template slot="header-text">
          <h2>Add block to array</h2>                
        </template>
        <template slot="content">
          <p>Select block type to add to array</p>
          <label class="array-editor__select">
            <select
              class="array-editor__select__control"
              v-model="addBlockModal.selected"
            >
              <option
                class="array-editor__select__control__option"
                v-for="option in addBlockModal.options"
                v-bind:key="option"
                :value="option"
              >{{ option }}</option>
            </select>
            <span class="array-editor__select__label">Block</span>
            <svg class="array-editor__select__icon feather" :class="{'is-hidden': this.active}">
              <use xlink:href="#chevron-down"></use>
            </svg>
          </label>
        </template>
        <template slot="footer">
          <button class="modal__button modal__button--green" @click="addItem">Add block</button>
          <button class="modal__button modal__button--default" @click="toggleAddBlockModal">Cancel</button>
        </template>
      </modal>
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
import Modal from "../Global/Modal";

export default {
  name: "json-data-array",
  data() {
    return {
      active: false,
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
    toggleActive() {
      this.active = !this.active;
    },
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
    deleteItem(item) {
      var index = this.$props.items.indexOf(item);
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
      if(this.isAnyOf) {
        this.addBlockModal.isOpen = false;
        var item = {};
        item['$ref'] = this.addBlockModal.selected;
        this.$props.items.push(item);
      }
      else {
        api.getEmpty("/"+ this.blockName, this.relPath)
        .then(response => {
          that.$props.items.push(response.data);
        });
      }

    }
  },
  props: ["label", "items", "depth", "absPath", "relPath", "blockName"],
  components: {
    draggable,
    Modal
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
  
  }  

  .object-editor.is-active ~ #{$this}__item__footer {
    display: none;
  }

  &__section {
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
      margin-top: $json-data-editor__v-spacing;
      padding-top: $json-data-editor__v-spacing * 1.5;
      margin-bottom: $json-data-editor__v-spacing;
    }
  }

  &__item {
    position: relative;

    &__footer {
      top: $json-data-editor__v-spacing;
      right: 0;
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
      color: $colour-body-bgnd-dark-grey;
      background-color: $colour-grey-xlight;
      margin-right: -$column-gutter-default;
      padding-left: size(5px);
      padding-right: $column-gutter-default;

      #{$this}__item__footer {
        right: $column-gutter-default;
      }
    }
  }

  &__select {
    @include form-select($this: &);
  }
}
</style>
