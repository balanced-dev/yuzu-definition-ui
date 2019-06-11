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
        :item="item"
        :depth="depth+1"
        :path="path"
      ></json-data-property>
      <json-data-block-type :item="item" :path="path"></json-data-block-type>
    </div>
  </div>
</template>

<script>
export default {
  name: "json-data-object",
  data() {
    return {
      active: false
    };
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
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
