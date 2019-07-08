<template>
  <modal class="modal-root-save-state" @close="cancelFunction">
    <template slot="header-text">
      <h2>Confirm save</h2>                
    </template>
    <template slot="content">
      <p>Do you want to overwrite the current state?</p>
      <p><strong>WARNING:</strong> Any changes within sub-blocks will cause their appropriate state to be overwritten with the content in this current state!</p>
    </template>
    <template slot="footer">
      <button class="modal__button modal__button--green" @click="saveFunction">Confirm</button>
      <button class="modal__button modal__button--red" @click="cancelFunction">Cancel</button>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "modal-root-save-state",
  components: {
    Modal
  },
  props: ["saveFunction", "cancelFunction"],
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.modal-root-save-state {}
</style>
