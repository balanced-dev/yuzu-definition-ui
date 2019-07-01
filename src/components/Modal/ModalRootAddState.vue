<template>
  <modal class="modal-root-add-state" @close="cancelFunction">
    <template slot="header-text">
      <h2>Confirm save state</h2>                
    </template>
    <template slot="content">
      <p v-if="!isAsNew">Do you want to overwrite the current state or save as a new state?</p>
      <p><strong>WARNING:</strong> Any changes within sub-blocks will cause their appropriate state to be overwritten with the content in this current state!</p>
      <template v-if="isAsNew">
        <label class="modal-root-add-state__input">
          <input class="modal-root-add-state__input__control modal-root-add-state__input__control--text" type="text" v-model="name" placeholder='e.g. "longDescription", "empty"' />
          <span class="modal-root-add-state__input__label">New state name</span>
        </label>
      </template>
    </template>
    <template slot="footer">
      <button class="modal__button modal__button--green" v-if="!isAsNew" @click="saveFunction">Overwrite</button>
      <button class="modal__button modal__button--default" @click="saveNewFunction(name)">Save as new</button>
      <button class="modal__button modal__button--red" @click="cancelFunction">Cancel</button>
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
  mounted() {
    this.name = '';
  },
  components: {
    Modal
  },
  props: ["isAsNew", "saveFunction", "saveNewFunction", "cancelFunction"],
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
