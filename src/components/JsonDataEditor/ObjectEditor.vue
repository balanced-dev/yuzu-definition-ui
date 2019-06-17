<template>
  <div class="object-editor" :class="[{'is-active': this.active}, `object-editor--depth-${depth}`]">
    <label class="object-editor__title" @click="toggleActive" :style="{'padding-left': `${depth}rem`}">
      <svg class="object-editor__title__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#plus-square"/>
      </svg>
      <svg class="object-editor__title__icon feather" :class="{'is-hidden': !this.active}">
        <use xlink:href="#minus-square"/>
      </svg>
      <span class="object-editor__title__text">
        {{ label }}
      </span>
    </label>
    <div class="object-editor__section" v-if="active">
      <json-data-property
        :item="resolvedItem"
        :depth="depth+1"
        :path="path"
      ></json-data-property>
      <json-data-block-type v-if="isRef" :item="item" :depth="depth+1" :subBlock="subBlock"></json-data-block-type>
    </div>
  </div>
</template>

<script>
import bootstrap from "../../bootstrap";
export default {
  name: "json-data-object",
  data() {
    return {
      active: false,
      isRef: false,
      subBlock: {
        raw: "",
        name: "",
        state: "",
        data: {}
      }
    };
  },
  computed: {
    refs() {
      return this.$store.state.data.refs;
    },
    resolvedItem() {
      return this.isRef ? this.subBlock.data : this.item
    }
  },
  mounted() {
    var ref = this.item['$ref'];
    if(this.item['$ref']) {
      this.subBlock.raw = ref;
      this.subBlock.name = bootstrap.getBlockFromRef(ref);
      this.subBlock.state = bootstrap.getStateFromRef(ref);
      this.subBlock.data = this.refs[ref];
      this.isRef = true;
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    },
    updated: function() {
      this.$store.dispatch("data/saveRef", this.subBlock);
    }
  },
  created: function() {
    this.debouncedUpdate = _.debounce(this.updated, 500)
  },
  watch: {
    subBlock: {
      deep: true,
      handler: function() {
        this.debouncedUpdate();
      }
    }
  },
  props: ["label", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.object-editor {
  $this: &;

  @include json-data-editor__section($this, $includeSectionPadding: false);
}
</style>
