<template>
  <div class="collapse" :class="[{'is-active': isOpen}, `collapse--depth-${depth}`]">
    <span class="collapse__title" @click="open" :style="{'padding-left': `${depth}rem`}">
      <svg class="collapse__title__icon feather" :class="{'is-hidden': isOpen}">
        <use xlink:href="#plus-square"/>
      </svg>
      <svg class="collapse__title__icon feather" :class="{'is-hidden': !isOpen}">
        <use xlink:href="#minus-square"/>
      </svg>
      <span class="collapse__title__text">
        {{ guessCollapsedTitle }}
      </span>
    </span>
    <slot name="arrayActions"></slot>
    <div class="collapse__section" v-if="isOpen">
      <json-data-property
        :item="item"
        :depth="depth+1"
        :absPath="absPath"
        :relPath="relPath"
        :blockName="blockName"
        :ofType="ofType"
      ></json-data-property>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import inflector from "inflector-js";

export default {
  name: "json-data-collapsible-property",
  data() {
    return {
      isOpen: false,
      guesses: ['type', 'title']
    };
  },
  computed: {
    guessCollapsedTitle() {
      var output = inflector.singularize(this.label) +' '+ this.originalIndex;
      this.$store.dispatch("itemTitle/get", {
        item: this.item,
        action: function(text, item) {
          output = item[text];
        }
      });
      return output;
    }
  },
  methods: {
    open: function() {
      this.$data.isOpen = !this.$data.isOpen;
    }
  },
  props: ["label", "item", "depth", "absPath", "relPath", "arrayIndex", "originalIndex", "blockName", "ofType"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';
.collapse {
  $this: &;

  @include json-data-editor__section($this, $title-v-padding: true);
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  &__title {
    flex: 1 1 auto;
    max-width: calc(100% - #{size(160px)});

    &__icon {
    }

    &__text {
    }
  }

  &__section {
    width: 100%;
  }

  &.is-active {
    // padding-bottom: $json-data-editor__v-spacing;
  }
}
</style>
