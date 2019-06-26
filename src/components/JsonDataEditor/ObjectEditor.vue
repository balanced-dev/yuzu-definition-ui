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
      <span class="object-editor__title__text">{{ label }}</span>
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
      isRef: false,
      subBlock: {
        raw: "",
        name: ""
      }
    };
  },
  computed: {
    ref() {
      return this.refs[this.item["$ref"]];
    },
    refs() {
      return this.$store.state.data.refs;
    },
    resolvedItem() {
      return this.isRef ? this.ref : this.item;
    }
  },
  mounted() {
    var ref = this.item["$ref"];

    if (ref) {
      if (!this.refs.hasOwnProperty(ref)) {
        //safety value to pull in refs that have been added are actual in location data
        var that = this;
          api.getEmpty(ref).then(response => {
            that.$props.item = response.data;
          });
      } else {
        this.subBlock.name = bootstrap.blockFromState(ref);
        this.subBlock.defaultState = bootstrap.defaultFromState(ref);
        this.subBlock.state = ref;
        this.isRef = true;
      }
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
      if (this.isRef) {
        api.setActive(this.absPath, this.active);
      }
    },
    updated: function() {
      if(this.ref)
        this.$store.dispatch("data/saveRef", this.ref);
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
  props: ["label", "item", "depth", "absPath", "relPath"]
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.object-editor {
  $this: &;

  @include json-data-editor__section($this, $title-v-padding: true);
}
</style>
