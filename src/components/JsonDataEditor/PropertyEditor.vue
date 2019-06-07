<template>
  <div class="property">
    <div v-if="!isCollapsed" :style="indent">
      <span class="collapse" v-if="isArrayItem" @click="collapse">-</span>
      <div v-for="key in Object.keys(item)" v-bind:key="key">
        <div v-if="isObject(item[key])" class="objectSelector">
          <json-data-object :label="key" :item="item[key]" :depth="depth"></json-data-object>
        </div>
        <div v-else-if="isArray(item[key])" class="objectSelector">
          <json-data-array :label="key" :items="item[key]" :depth="depth"></json-data-array>
        </div>
        <div v-else class="propertyEditor">
          <label>{{ key }}</label>
          <input type="text" :value="item[key]">
        </div>
      </div>
    </div>
    <div v-if="isCollapsed" @click="uncollapse" :style="indent">
      item {{ arrayIndex }}
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import JsonDataArray from "./ArrayEditor.vue";
import JsonDataObject from "./ObjectEditor.vue";

export default {
  name: "json-data-property",
  data() {
    return {
      isCollapsed: this.$props.collapsed
    };
  },
  computed: {
    indent() {
      return { transform: `margin-left: ${this.depth * 15}px` };
    }
  },
  methods: {
    isObject: function(item) {
      return _.isPlainObject(item);
    },
    isArray: function(item) {
      return _.isArray(item);
    },
    collapse: function() {
      if(this.$props.isArrayItem) {
        this.$data.isCollapsed = true;
      }
    },
    uncollapse: function() {
      this.$data.isCollapsed = false;
    }
  },
  props: ["item", "depth", "isArrayItem", "collapsed", "arrayIndex"],
  components: {
    JsonDataArray,
    JsonDataObject
  },
  events: {
    sort: function( item, oldIndex, newIndex ) {
      console.log( "Sort!" );
      console.log( item );
    }
  }
};
</script>

<style scoped lang="scss">
.property {
  position: relative;
}
.collapse {
    position: absolute;
    top: -15px;
    display: block;
    font-size: 46px;
    line-height: 1px;
    cursor: pointer;
}
.objectSelector {
  margin: 10px 0;
  padding: 20px;
  padding-top: 0px;
  border: 1px solid red;
}
.propertyEditor {
  margin: 20px 0;
}
label {
  margin-right: 10px;
  display: inline-block;
  min-width: 120px;
}
input {
  width: 250px;
  padding: 15px;
}
</style>
