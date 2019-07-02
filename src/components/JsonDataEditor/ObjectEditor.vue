<template>
  <div class="object-editor" :class="[{'is-active': this.active}, `object-editor--depth-${depth}`]">
    <label
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
      <span class="object-editor__title__text">{{ resolvedLabel }}</span>
    </label>
    <div class="object-editor__section" v-if="active">
      <json-data-property
        v-if="isSubBlock"
        :item="subBlockState"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="''"
        :blockName="subBlockMeta.name"
        :parentState="refString"
      ></json-data-property>
      <json-data-property
        v-if="!isSubBlock"
        :item="item"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="relPath"
        :blockName="blockName"
        :parentState="parentState"
      ></json-data-property>
      <json-data-block-type v-if="isSubBlock" :item="item" :depth="depth+1" :subBlock="subBlockMeta"></json-data-block-type>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import bootstrap from "../../bootstrap";
export default {
  name: "json-data-object",
  data() {
    return {
      active: false,
      subBlockMeta: {
        name: "",
        defaultState: "",
        state: ""
      }, 
      resolvedLabel: ""
    };
  },
  computed: {
    isSubBlock() {
      return this.item.hasOwnProperty("$ref");
    },  
    refString() {
      return this.item["$ref"]
    },
    subBlockState() {
      return this.$store.getters["state/get"](this.refString);
    }
  },
  mounted() {
    if (this.isSubBlock) {
      this.subBlockMeta.name = bootstrap.blockFromState(this.refString);
      this.subBlockMeta.defaultState = bootstrap.defaultFromState(this.refString);
      this.subBlockMeta.state = this.refString;
      this.$store.dispatch("blockPaths/load", this.subBlockMeta.name);
      this.$store.dispatch("state/load", this.refString);
    }

    this.resolvedLabel = this.label;
    if(this.isAnyOf && this.subBlockState) {
      this.setAnyOfLabel();
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
      if (this.isSubBlock) {
        api.setActive(this.absPath, this.active);
      }
    },
    setAnyOfLabel: function() {
      if(this.subBlockState) {
        var that = this;
        this.$store.dispatch("itemTitle/get", {
          item: this.subBlockState,
          action: function(text, item) {
            if(that.label === that.refString) {
              that.resolvedLabel = item[text] +" ("+ that.label +")";
            }
          }
        });
      }
    },
    updated: function() {
      if(this.isSubBlock) {
        this.$store.dispatch("state/update", { 
          name: this.refString,
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
}
</style>
