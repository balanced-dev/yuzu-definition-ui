<template>
  <div v-if="item" :style="indent" :class="arraySelector">
    <div v-for="(key) in Object.keys(item)" v-bind:key="key">
      <div v-if="isPlainObject(item[key])" class="objectSelector">
        <strong @click="toggleShow(key)">+ {{key}}</strong>
        <json-data-editor-property
          v-if="show(key)"
          :item="item[key]"
          :depth="depth + 1"
          :isArrayItem="false"
        ></json-data-editor-property>
      </div>
      <div v-else-if="isArray(item[key])" class="objectSelector">
        <strong @click="toggleShow(key)">+ {{key}}</strong>
        <span v-if="show(key)">
          <div v-for="(arrayItem) in item[key]" v-bind:key="arrayItem">
            <json-data-editor-property :item="arrayItem" :depth="depth + 1" :isArrayItem="true"></json-data-editor-property>
          </div>
        </span>
      </div>
      <div v-else class="propertyEditor">
        <label>{{key}}</label>
        <input type="text" :value="item[key]">
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "json-data-editor-property",
  data() {
    return {
      displayed: []
    };
  },
  computed: {
    arraySelector() {
      if (this.isArrayItem) {
        return "arraySelector";
      }
      return '';
    },
    indent() {
      return { transform: `margin-left: ${this.depth * 15}px` };
    }
  },
  methods: {
    isPlainObject: function(item) {
      return _.isPlainObject(item);
    },
    isArray: function(item) {
      return _.isArray(item);
    },
    show: (name) => {
      return true;
    },
    toggleShow(name) {
      if(_.includes(this.$data.displayed, name)) {
        _.remove(this.$data.displayed, function(item) { return item == name });
      }
      else {
        this.$data.displayed.push(name);
      }
    }
  },
  props: ["item", "depth", "isArrayItem"]
};
</script>

<style scoped lang="scss">
.arraySelector {
  margin: 10px 0;
  padding: 10px 20px;
  border: 1px solid green;
}
.objectSelector {
  margin: 10px 0;
  padding: 20px;
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
