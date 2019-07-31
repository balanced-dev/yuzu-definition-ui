<template>
  <modal class="modal-root-add-state" @close="cancelFunction();reset();">
    <template slot="header-text">
      <h2>Add new state</h2>                
    </template>
    <template slot="content">
      <p>Do you want to overwrite the current state or save as a new state?</p>
      <p><strong>WARNING:</strong> Any changes within sub-blocks will cause their appropriate state to be overwritten with the content in this current state!</p>
      <p><strong>IF CREATING NEW BLANK STATE:</strong> Any sub-blocks which use non-inline data (i.e. using a state) will need to be created and saved manually. They will not be blank</p>
      <template>
        <label class="modal-root-add-state__input">
          <input class="modal-root-add-state__input__control modal-root-add-state__input__control--text" type="text" v-model="name" placeholder='e.g. "longDescription", "empty"' @input="validateFunction(name)" v-on:keyup.enter="addFunction(true,name);"/>
          <span class="modal-root-add-state__input__label">New state name</span>
        </label>
      </template>
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
  name: "modal-root-add-state",
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
  components: {
    Modal
  },
  props: ["isValid", "validateFunction", "addFunction", "cancelFunction"],
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.modal-root-add-state {
  &__input {
    @include form-input;
  }
}
</style>
