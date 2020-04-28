<template>
  <div class="block-type-editor" v-if="subBlock" :class="`block-type-editor--depth-${depth}`">
    <modal-block-add-state 
      :v-if="addModal.isOpen"
      :isValid="addModal.isValid"
      :validateFunction="stateNameIsValid"
      :addFunction="createNewState"
      :cancelFunction="toggleAddModal"
      v-if="addModal.isOpen"
    ></modal-block-add-state>
    <div class="block-type-editor__select">
      <select
        class="block-type-editor__select__control"
        v-model="subBlock.state"
        @change="changeState()"
      >
        <option
          class="block-type-editor__select__control__option"
          v-for="state in states"
          v-bind:key="state.name"
          :value="state.value"
        >{{ state.name }}</option>
      </select>
      <span class="block-type-editor__select__label">{{blockName}}</span>
      <svg class="block-type-editor__select__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#chevron-down"></use>
      </svg>
    </div>
    <a href="" class="block-type-editor__button block-type-editor__button--link">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#link"/>
      </svg>
      <span class="block-type-editor__button__text">Go to block</span>
    </a>
    <button class="block-type-editor__button block-type-editor__button--add" @click="toggleAddModal">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#plus"/>
      </svg>
      <span class="block-type-editor__button__text">Add new state</span>
    </button>
    <button class="block-type-editor__button block-type-editor__button--highlight" @click="highlight" :class="[{'is-active': this.highlighted}]">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#crosshair"/>
      </svg>
      <span class="block-type-editor__button__text"><template v-if="!this.highlighted">Highlight block</template>
            <template v-else>Remove highlighting</template></span>
    </button>
  </div>
</template>

<script>
import api from "../../api";
import bootstrap from "../../bootstrap";
import _ from "lodash";
import ModalBlockAddState from "../Modal/ModalBlockAddState";

export default {
  name: "json-data-block-type",
  data() {
    return {
      active: true,
      highlighted: false,
      addModal: {
        isOpen: false,
        name: "",
        isValid: false
      }
    };
  },
  computed: {
    states() {
      return this.$store.getters["blockStates/get"](this.blockName);
    }
  },
  mounted() {
    this.$store.dispatch("blockStates/loadStates", { 
      block: this.blockName,
      state: this.subBlock.state
    });
  },
  beforeDestroy() {
    if(this.highlighted) {
      this.highlighted = false;
      api.setActive(this.absPath, this.highlighted);  
    }
  },
  methods: {
    toggleAddModal: function() {
      this.addModal.isOpen = !this.addModal.isOpen;
    },
    highlight() {
      this.highlighted = !this.highlighted;
      api.setActive(this.absPath, this.highlighted);
    },
    addNewStateOption: function(state) {
      this.$store.dispatch("blockStates/addNewState", 
        { 
          name: this.addModal.name,
          value: state,
          block: this.blockName
      });
      this.subBlock.state = state;
    },
    changeState: function() {
      var state = this.subBlock.state;
      var that = this;

      if(!this.$store.getters["state/has"](state)) {
        api.get(state)
        .then(function(response) {
          that.addRef(state, response.data);
          that.saveNewItemState(state);
        });
      }
      else {
        this.saveNewItemState(state);
      }
    },
    stateNameIsValid(name) {
      this.addModal.isValid = name.length > 0 && !this.states.find( state => state.name === name );
      return this.addModal.isValid;
    },
    createNewState: function(isDuplicate, stateName) {
      this.addModal.name = stateName;

      if(this.stateNameIsValid(stateName)) {

        var state = bootstrap.createNewStateName(this.subBlock.state, this.addModal.name);
        this.addModal.isOpen = false;

        if(!isDuplicate) {
          api.getEmpty(this.blockName)
          .then(response => {
            this.saveNewState(state, response.data);
          });
        }
        else {
          var data = _.cloneDeep(this.$store.getters["state/get"](this.subBlock.state));
          this.saveNewState(state, data);
        }
      }
    },
    saveNewState: function(state, data) {
      this.addRef(state, data);
      this.saveNewItemState(state);
      this.addNewStateOption(state);
    },
    saveNewItemState: function(state) {
      this.item["$ref"] = state
    },
    addRef: function(state, data) {
      var payload = {
        name: state,
        state: data
      };
      this.$store.dispatch("state/add", payload);
    }
  },
  props: ["item", "depth", "subBlock", "blockName", "absPath"],
  components: {
    ModalBlockAddState
  }
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.block-type-editor {
  $this: &;

  align-items: center;
  display: flex;
  margin-left: auto;
  padding-right: $column-gutter-default / 2;

  &__button {
    @include u-reset-button;
    display: block;
    margin-left: ($column-gutter-default / 4);
    padding: ($column-gutter-default / 4);
    position: relative;

    &--link {
      background-color: $colour-blue;
    }
    &--add {
      background-color: $colour-green;
    }
    &--highlight {
      &.is-active {
        background-color: $colour-red;
      }
    }

    &__icon {
      color: $colour-white;
      display: block;
      height: 1.25em;
      width: 1.25em;
    }

    &__text {
      @include font-size($font-size-xsmall);
      box-shadow: $drop-shadow;
      background-color: $colour-grey-darker;
      border: 1px solid transparent;
      color: $colour-text-default;
      display: none;
      line-height: 1;
      right: 0;
      margin-top: size(6px);
      padding: ($column-gutter-default / 4);
      position: absolute;
      top: 100%;
      white-space: nowrap;
      z-index: 1;

      &::before {
        background-color: inherit;
        border-left: inherit;
        border-top: inherit;
        content: "";
        height: $column-gutter-default / 2;
        right: $column-gutter-default / 2;
        position: absolute;
        top: -($column-gutter-default / 4 + size(1px));
        transform: rotate(45deg);
        width: $column-gutter-default / 2;
      }
    }

    &:hover {
      #{$this}__button__text {
        display: block;
      }
    }
  }

  &__select {
    @include form-select($this: &, $overlayLabel: true, $height: size(26.75px), $bgColour: $colour-grey-darker, $borderColour: $colour-grey-mid-dark);
    &__control {

      &__option {

      }
    }

    &__label {

    }

    &__icon {

    }
  }
}
</style>
