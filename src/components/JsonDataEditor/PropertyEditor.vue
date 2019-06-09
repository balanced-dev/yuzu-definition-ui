<template>
  <div class="property" :style="indent">
    <div v-for="key in Object.keys(item)" v-bind:key="key">
      <div v-if="isObject(item[key])" class="objectSelector">
        <json-data-object :label="key" :item="item[key]" :depth="depth" :path="buildPath(key)"></json-data-object>
      </div>
      <div v-else-if="isArray(item[key])" class="objectSelector">
        <json-data-array :label="key" :items="item[key]" :depth="depth" :path="buildPath(key)"></json-data-array>
      </div>
      <div v-else class="propertyEditor">
        <label>{{ key }}</label>
        <input v-if="valueLength(key) <= 50" type="text" v-model="item[key]">
        <textarea v-if="valueLength(key) > 50" v-model="item[key]"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import JsonDataArray from "./ArrayEditor.vue";
import JsonDataObject from "./ObjectEditor.vue";

export default {
  name: "json-data-property",
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
    valueLength(key) {
      return this.$props.item[key].length;
    },
    buildPath(key) {
      return this.$props.path +'/'+ key;
    }
  },
  props: ["item", "depth", "path"],
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
.objectSelector {
  margin: 10px 0;
  padding: 20px;
  padding-top: 0px;
  border: 1px solid red;
}
.propertyEditor {
  margin: 20px 0;
}
.propertyEditor * {
  vertical-align: top;
}
label {
  margin-top: 16px;
  margin-right: 10px;
  display: inline-block;
  min-width: 120px;
}
input {
  width: 250px;
  padding: 15px;
}
textarea {
  width: 300px;
  height: 250px;
  padding: 15px;
  line-height: 20px;
}
</style>
