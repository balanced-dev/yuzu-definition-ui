<template>
  <div class="block-type-editor" v-if="subBlock" :class="`block-type-editor--depth-${depth}`">
    <modal v-if="addModal.isOpen" @close="toggleAddModal">
      <template slot="header-text">
        <h2>Add new state</h2>                
      </template>
      <template slot="content">
        <label class="block-type-editor__text-editor">
          <input class="block-type-editor__text-editor__control block-type-editor__text-editor__control--text" type="text" v-model="addModal.name" placeholder='e.g. "longDescription", "empty"' />
          <span class="block-type-editor__text-editor__label">New state name</span>
        </label>
      </template>
      <template slot="footer">
        <button class="modal__button modal__button--green" @click="createNewState(true)">Duplicate current</button>
        <button class="modal__button modal__button--default" @click="createNewState(false)">Create blank</button>
        <button class="modal__button modal__button--red" @click="toggleAddModal">Cancel</button>
      </template>
    </modal>
    <label class="block-type-editor__select">
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
      <span class="block-type-editor__select__label">{{subBlock.name}}</span>
      <svg class="block-type-editor__select__icon feather" :class="{'is-hidden': this.active}">
        <use xlink:href="#chevron-down"></use>
      </svg>
    </label>
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
    <!-- <button class="block-type-editor__button block-type-editor__button--save">
      <svg class="block-type-editor__button__icon feather">
        <use xlink:href="#save"/>
      </svg>
      <span class="block-type-editor__button__text">Save state</span>
    </button> -->
  </div>
</template>

<script>
import api from "../../api";
import bootstrap from "../../bootstrap";
import _ from "lodash";
import Modal from "../Global/Modal";

export default {
  name: "json-data-block-type",
  data() {
    return {
      active: true,
      addModal: {
        isOpen: false,
        name: ""
      }
    };
  },
  computed: {
    refs() {
      return this.$store.state.data.refs;
    },
    blocks() {
      return this.$store.state.blocks.items;
    },
    states() {
      return this.$store.getters["blockStates/get"](this.subBlock.name);
    }
  },
  mounted() {
    this.$store.dispatch("blockStates/loadStates", { 
      block: this.subBlock.name,
      state: this.subBlock.state
    });
  },
  methods: {
    toggleAddModal: function() {
      this.addModal.isOpen = !this.addModal.isOpen;
    },
    addNewStateOption: function(state) {
      this.$store.dispatch("blockStates/addNewState", 
        { 
          name: this.addModal.name,
          value: state,
          block: this.subBlock.name
      });
      this.subBlock.state = state;
    },
    changeState: function() {
      var state = this.subBlock.state;
      var that = this;

      if(!this.refs[state]) {
        api.get(state)
        .then(function(response) {
          that.saveRef(state, response.data);
          that.saveNewItemState(state);
        });
      }
      else {
        this.saveNewItemState(state);
      }
    },
    createNewState: function(duplicate) {
      var state = bootstrap.createNewStateName(this.subBlock.state, this.addModal.name);
      this.addModal.isOpen = false;

      if(!duplicate) {
        api.getEmpty(this.subBlock.name)
        .then(response => {
          this.saveNewState(state, response.data);
        });
      }
      else {
        var data = _.cloneDeep(this.refs[this.subBlock.state]);
        this.saveNewState(state, data);
      }
    },
    saveNewState: function(state, data) {
        this.saveRef(state, data);
        this.saveNewItemState(state);
        this.addNewStateOption(state);
    },
    saveNewItemState: function(state) {
      this.item["$ref"] = state
    },
    saveRef: function(state, data) {
      var payload = {
        state: state,
        data: data
      };
      this.$store.dispatch("data/saveRef", payload);
    }
  },
  props: ["item", "depth", "subBlock"],
  components: {
    Modal
  }
};
</script>

<style scoped lang="scss">
@import "../../scss/main";

.block-type-editor {
  $this: &;

  align-items: center;
  display: flex;
  position: absolute;
  right: 0;
  top: 0;

  &--depth-1 {
    
  }

  &--depth-2 {
    right: $column-gutter-default;
    top: size(3px);
  }

  &__text-editor {
    @include form-input;
  }

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
    &--save {
      background-color: $colour-green;
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
    @include form-select($this: &, $overlayLabel: true);
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
