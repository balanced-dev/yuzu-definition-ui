<template>
  <modal @close="cancelFunction">
    <template slot="header-text">
      <h2>Confirm deletion</h2>                
    </template>
    <template slot="content">
      <p>Are you sure you want to delete this item from the "{{item.path}}" array?</p>
    </template>
    <template slot="footer">
      <button class="modal__button modal__button--red" @click="deleteFunction">Delete</button>
      <button class="modal__button modal__button--default" @click="cancelFunction">Cancel</button>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "modal-array-editor-delete",
  components: {
    Modal
  },
  props: ["deleteFunction", "cancelFunction", "item"],
};
</script>

<style scoped lang="scss">
@import '../../scss/main';
</style>
