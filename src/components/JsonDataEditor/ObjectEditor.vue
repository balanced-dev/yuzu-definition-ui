<template>
  <div class="object-editor" :class="[{'is-active': this.active}, `object-editor--depth-${depth}`]">
    <div
      class="object-editor__title"
      @click="toggleActive"
      :style="{'padding-left': `${depth}rem`}"
    >
      <svg class="object-editor__title__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#plus-square"></use>
      </svg>
      <svg class="object-editor__title__icon feather" :class="{'is-hidden': !this.active}">
        <use xlink:href="#minus-square"></use>
      </svg>
      <span class="object-editor__title__text">{{ resolvedLabel | striphtml }}</span>
    </div>
    <div class="object-editor__section" v-if="active">
      <div class="object-editor__section__menu" :style="{'padding-left': `${depth+1}rem`}">
        <button class="object-editor__target" :class="[{'is-active': this.highlighted}]" @click="highlight" v-if="isSubBlock">
          <svg class="object-editor__target__icon feather">
            <use xlink:href="#crosshair"/>
          </svg>
          <span class="object-editor__target__text">
            <template v-if="!this.highlighted">Apply</template>
            <template v-else>Remove</template> 
            element highlighting in-page</span>
        </button>
      </div>
      <json-data-property
        v-if="isSubBlock"
        :item="subBlockState"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="''"
        :blockName="subBlockMeta.name"
        :parentState="subBlockRef"
      ></json-data-property>
      <json-data-property
        v-if="!isSubBlock && !isInlineBlock"
        :item="item"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="relPath"
        :blockName="blockName"
        :parentState="parentState"
      ></json-data-property>
      <json-data-property
        v-if="!isSubBlock && isInlineBlock"
        :item="inlineBlockState"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="''"
        :blockName="inlineBlockMeta.name"
        :parentState="parentState"
      ></json-data-property>
      <json-data-block-type 
        v-if="isSubBlock" 
        :item="item" 
        :depth="depth+1" 
        :subBlock="subBlockMeta"
        ></json-data-block-type>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import bootstrap from "../../bootstrap";
import { readSync } from 'fs';
export default {
  name: "json-data-object",
  data() {
    return {
      active: false,
      highlighted: false,
      subBlockMeta: {
        name: "",
        defaultState: "",
        state: ""
      }, 
      inlineBlockMeta: {
        name: ""
      }, 
      resolvedLabel: ""
    };
  },
  computed: {
    isSubBlock() {
      return this.item.hasOwnProperty("$ref");
    },  
    subBlockRef() {
      return this.item["$ref"];
    },
    subBlockState() {
      return this.$store.getters["state/get"](this.subBlockRef);
    },
    isInlineBlock() {
      var f= this.$store.getters['blockPaths/has'](this.blockName, this.relPath);
      return f;
    },
    inlineBlockRef() {
      var f= this.$store.getters['blockPaths/get'](this.blockName, this.relPath)[0];
      return f;
    },
    inlineBlockState() {
      if(this.item) {
        return this.item;
      }
      else {
        return this.$store.getters["state/get"](this.inlineBlockRef);
      }
    },
  },
  mounted() {
    if (this.isSubBlock) {
      this.subBlockMeta.name = bootstrap.blockFromState(this.subBlockRef);
      this.subBlockMeta.defaultState = bootstrap.defaultFromState(this.subBlockRef);
      this.subBlockMeta.state = this.subBlockRef;
      this.$store.dispatch("blockPaths/load", this.subBlockMeta.name);
      this.$store.dispatch("state/load", this.subBlockRef);
    }

    if (this.isInlineBlock) {
      this.inlineBlockMeta.name = bootstrap.blockFromState(this.inlineBlockRef);
      this.$store.dispatch("blockPaths/load", this.inlineBlockRef);
      this.$store.dispatch("state/load", this.inlineBlockRef);
    }

    this.resolvedLabel = this.label;
    if(this.isAnyOf && this.subBlockState) {
      this.setAnyOfLabel();
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    },
    highlight() {
      this.highlighted = !this.highlighted;
      api.setActive(this.absPath, this.highlighted);
    },
    setAnyOfLabel: function() {
      if(this.subBlockState) {
        var that = this;
        this.$store.dispatch("itemTitle/get", {
          item: this.subBlockState,
          action: function(text, item) {
            if(that.label === that.subBlockRef) {
              that.resolvedLabel = item[text] +" ("+ that.label +")";
            }
          }
        });
      }
    },
    updated: function() {
      if(this.isSubBlock) {
        this.$store.dispatch("state/update", { 
          name: this.subBlockRef,
          state: this.subBlockState
        });
        this.$store.commit('triggerPreview');
      }

      if(this.isAnyOf)
        this.setAnyOfLabel();
    }
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500);
  },
  watch: {
    subBlockState: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  },
  props: ["label", "item", "depth", "absPath", "relPath", "blockName", "isAnyOf", "parentState"]
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.object-editor {
  $this: &;

  @include json-data-editor__section($this, $title-v-padding: true);

  &__section {
    &__menu {
      display: flex;
      justify-content: flex-end;
      padding-right: $column-gutter-default;
    }
  }

  &__target {
    @include u-reset-button;
    @include font-size($font-size-xsmall);
    @include default-font;
    align-items: center;
    background-color: $colour-green;
    color: $colour-white;
    display: inline-flex;
    line-height: 1;
    margin-top: $json-data-editor__v-spacing;
    padding: $column-gutter-default / 2;
    text-decoration: none;

    &.is-active {
      background-color: $colour-red;
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
  }
}
</style>
