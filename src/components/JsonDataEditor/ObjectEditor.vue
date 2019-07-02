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
        :item="resolvedItem"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="''"
        :blockName="subBlock.name"
      ></json-data-property>
      <json-data-block-type v-if="isRef" :item="item" :depth="depth+1" :subBlock="subBlock"></json-data-block-type>
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
      subBlock: {
        name: "",
        defaultState: "",
        state: ""
      }, 
      resolvedLabel: ""
    };
  },
  computed: {
    isRef() {
      return this.item.hasOwnProperty("$ref");
    },  
    refString() {
      return this.item["$ref"]
    },
    ref() {
      return this.$store.getters["state/get"](this.refString);
    },
    resolvedItem() {
      return this.isRef ? this.ref : this.item;
    }
  },
  mounted() {
    if (this.isRef) {
      this.subBlock.name = bootstrap.blockFromState(this.refString);
      this.subBlock.defaultState = bootstrap.defaultFromState(this.refString);
      this.subBlock.state = this.refString;
      this.$store.dispatch("blockPaths/load", this.subBlock.name);
      this.$store.dispatch("state/load", this.refString);
    }

    this.resolvedLabel = this.label;
    if(this.isAnyOf && this.ref) {
      this.setAnyOfLabel();
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
      if (this.isRef) {
        api.setActive(this.absPath, this.active);
      }
      if(this.active) {
        this.tryPopulateOrphanRef();
      }
    },
    setAnyOfLabel: function() {
      if(this.ref) {
        var that = this;
        this.$store.dispatch("itemTitle/get", {
          item: this.ref,
          action: function(text, item) {
            if(that.label === that.refString) {
              that.resolvedLabel = item[text] +" ("+ that.label +")";
            }
          }
        });
      }
    },
    tryPopulateOrphanRef: function() {
      //safety value to pull in refs that have been added are actual in location data
      if(this.refString && !this.isRef) {
        var that = this;
        api.getEmpty(this.refString).then(response => {
          that.$props.item = response.data;
        });
      }

    },
    updated: function() {
      if(this.isRef)
        this.$store.dispatch("state/update", { 
          name: this.refString,
          state: this.ref
        });
      if(this.isAnyOf)
        this.setAnyOfLabel();
    }
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500);
  },
  watch: {
    ref: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  },
  props: ["label", "item", "depth", "absPath", "relPath", "isAnyOf"]
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.object-editor {
  $this: &;

  @include json-data-editor__section($this, $title-v-padding: true);
}
</style>
