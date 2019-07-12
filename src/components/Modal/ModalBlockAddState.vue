<template>
  <modal class="modal-block-add-state" @close="cancelFunction();reset();">
    <template slot="header-text">
      <h2>Add new state</h2>                
    </template>
    <template slot="content">
      <label class="modal-block-add-state__input">
        <input class="modal-block-add-state__input__control modal-block-add-state__input__control--text" type="text" v-model="name" placeholder='e.g. "longDescription", "empty"' @input="validateFunction(name)" v-on:keyup.enter="addFunction(true,name);reset();"/>
        <span class="modal-block-add-state__input__label">New state name</span>
      </label>
    </template>
    <template slot="footer">
      <button class="modal__button modal__button--green" @click="addFunction(true,name);reset();" :disabled="!isValid">Create duplicate</button>
      <button class="modal__button modal__button--default" @click="addFunction(false,name);reset();" :disabled="!isValid">Create blank</button>
      <button class="modal__button modal__button--red" @click="cancelFunction();reset();">Cancel</button>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "modal-block-add-state",
  data() {
    return {
      name: ''
    };
  },
  methods: {
    reset() {
      if(this.name.length > 0) {
        this.name = '';
      }
    }
  },
  props: ["isValid", "validateFunction", "addFunction", "cancelFunction"],
  components: {
    Modal
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.modal-block-add-state {
  &__input {
    @include form-input;
  }
}
</style>
