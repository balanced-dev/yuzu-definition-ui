<template>
  <div class="collapse">
    <span class="collapse__handle" @click="open" :style="{'padding-left': `${depth}rem`}">
      <svg class="collapse__handle__icon feather" :class="{'is-hidden': !isOpen}">
        <use xlink:href="#plus-square"/>
      </svg>
      <svg class="collapse__handle__icon feather" :class="{'is-hidden': isOpen}">
        <use xlink:href="#minus-square"/>
      </svg>
      <span class="collapse__handle__text">
        {{ guessCollapsedTitle }}
      </span>
    </span>
    <json-data-property
      v-if="!isOpen"
      :item="item"
      :depth="depth+1"
      :path="path"
      :blockName="blockName"
    ></json-data-property>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "json-data-collapsible-property",
  data() {
    return {
      isOpen: true,
      guesses: ['type', 'title']
    };
  },
  computed: {
    guessCollapsedTitle() {
      var output = 'item '+ this.$props.arrayIndex;
      for(let guess of this.$data.guesses) {
        var item = this.$props.item;
        if(item.hasOwnProperty(guess) && item[guess]) {
          output = item[guess];
          break;
        }
      };
      return output;
    }
  },
  methods: {
    open: function() {
      this.$data.isOpen = !this.$data.isOpen;
    }
  },
  props: ["item", "depth", "path", "arrayIndex", "blockName"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';
.collapse {
  &__handle {
    @include accordion-button($includeDropShadow: false);
  }
}
</style>
