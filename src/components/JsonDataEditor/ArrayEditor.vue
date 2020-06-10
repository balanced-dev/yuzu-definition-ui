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
        @end="handleMove"
        ghost-class="ghost"
        handle=".array-editor-actions__sort"
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
            :ofType="ofType"
          >
            <json-data-array-actions slot="arrayActions"
              :item="item"
              :relPath="relPath"
              :deleteFunction="setToDelete"
            >
            </json-data-array-actions>
          </json-data-object>
          <json-data-collapsible-property
            v-if="!isRef(item) && isObject(item)"
            :label="label"
            :item="item"
            :depth="depth + 1"
            :absPath="buildPath(index, absPath)"
            :relPath="relPath"
            :arrayIndex="index + 1"
            :originalIndex="originalIndexesArray.get(index) + 1"
            :blockName="blockName"
            :ofType="ofType"
          >
            <json-data-array-actions slot="arrayActions"
              :item="item"
              :relPath="relPath"
              :deleteFunction="setToDelete"
            >
            </json-data-array-actions>
          </json-data-collapsible-property>
          <div v-if="!isRef(item) && !isObject(item)" class="array-editor__section--property" :style="{'padding-left': `${depth + 1}rem`}">
            <json-data-text
              :index="index"
              :item="items"
              :depth="depth + 1"
              :absPath="buildPath(index, absPath)"
              :relPath="relPath"
            >
              <json-data-array-actions slot="arrayActions"
                :item="item"
                :relPath="relPath"
                :deleteFunction="setToDelete"
              >
              </json-data-array-actions>
            </json-data-text>
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
import JsonDataArrayActions from "./ArrayEditorActions";
import ModalArrayEditorAdd from "../Modal/ModalArrayEditorAdd";
import ModalArrayEditorDelete from "../Modal/ModalArrayEditorDelete";
import OriginalIndexes from "../../services/originalIndexes";

export default {
  name: "json-data-array",
  data() {
    return {
      toDelete: undefined,
      addBlockModal: {
        isOpen: false,
        options: [],
        selected: ''
      },
      originalIndexesArray: new OriginalIndexes(this.items)
    };
  },
  computed: {
    paths() {
      return this.$store.state.data.paths;
    },
    isAnyOf() {
      if(this.$store.getters['schema/has'](this.blockName, 'refs', this.relPath, this.ofType)) {
        this.addBlockModal.options = this.$store.getters['schema/get'](this.blockName, 'refs', this.relPath, this.ofType);
        this.addBlockModal.selected = this.addBlockModal.options[0];
        return this.addBlockModal.options.length > 1;
      }
      return false;
    }
  },
  methods: {
    handleMove(e) {
      this.originalIndexesArray.reorder(e.oldIndex, e.newIndex);
    },
    isRef(item) {
      return item.hasOwnProperty('$ref');
    },
    refLabel(item) {
      return item["$ref"];
    },
    isObject: function(item) {
      return _.isPlainObject(item);
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
      this.originalIndexesArray.deleteElement(index);
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
      this.addNewIndex();
    },
    addBlockItem(block) {
      this.addBlockModal.isOpen = false;
      var item = {};
      item['$ref'] = block;
      this.$props.items.push(item);
      this.addNewIndex();
    },
    addNewIndex() {
      this.originalIndexesArray.pushNewElement();
    }
  },
  props: ["label", "items", "depth", "absPath", "relPath", "blockName", "ofType"],
  components: {
    draggable,
    ModalArrayEditorAdd,
    ModalArrayEditorDelete,
    JsonDataArrayActions
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.array-editor {
  $this: &;

  @include json-data-editor__section($this);
  
  &__title {
    &__icon {
    }
  }  

  .object-editor.is-active ~ #{$this}__item__footer {
    display: none;
  }

  &__section {
    
    &__add {
      @include u-reset-button;
      @include array-editor-button;
      background-color: $colour-green;
      color: $colour-body-bgnd-dark-grey;

      &__icon {
      }

      &__text {

      } 
    }

    &--property {
      @include column-gutter('padding', 'right');
    }

    &__footer {
      border-top: 1px solid $colour-grey-light;
      padding-top: $json-data-editor__v-spacing * 1.5;
      padding-bottom: $json-data-editor__v-spacing;
    }
  }

  &__item {
    position: relative;

    &.ghost {
      $horizontal-shift: size(5px);

      color: $colour-body-bgnd-dark-grey;
      background-color: $colour-grey-xlight;
      margin-right: -$horizontal-shift;
      // padding-bottom: $json-data-editor__v-spacing;
      padding-left: $horizontal-shift;
      padding-right: $column-gutter-default;

      #{$this}__item__footer {
        right: $column-gutter-default;
      }
    }
  }

  &--depth-1 {
    #{$this}__title {
      padding-top: $json-data-editor__v-spacing;
      padding-bottom: $json-data-editor__v-spacing;
    }
  }
}
</style>
