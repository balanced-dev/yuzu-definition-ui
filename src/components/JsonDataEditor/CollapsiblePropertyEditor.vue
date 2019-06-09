<template>
  <div class="collapse">
    <div v-if="!isCollapsed">
      <span class="collapse__handle" @click="collapse">-</span>
      <json-data-property
        :item="item"
        :depth="depth + 1"
        :path="path"
      ></json-data-property>
    </div>
    <div v-if="isCollapsed" @click="uncollapse">
      {{ guessCollapsedTitle }}
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "json-data-collapsible-property",
  data() {
    return {
      isCollapsed: true,
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
    collapse: function() {
      this.$data.isCollapsed = true;
    },
    uncollapse: function() {
      this.$data.isCollapsed = false;
    }
  },
  props: ["item", "depth", "path", "arrayIndex"]
};
</script>

<style scoped lang="scss">
.collapse {
  position: relative;

  &__handle {
    position: absolute;
    top: -15px;
    display: block;
    font-size: 46px;
    line-height: 1px;
    cursor: pointer;
  }
}
</style>
