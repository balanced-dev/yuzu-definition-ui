<template>
  <modal class="modal-array-editor-add" @close="cancelFunction">
    <template slot="header-text">
      <h2>Add block to array</h2>                
    </template>
    <template slot="content">
      <p>Select block type to add to array</p>
      <label class="modal-array-editor-add__select">
        <select
          class="modal-array-editor-add__select__control"
          v-model="selected"
        >
          <option
            class="modal-array-editor-add__select__control__option"
            v-for="option in options"
            v-bind:key="option"
            :value="option"
          >{{ option }}</option>
        </select>
        <span class="modal-array-editor-add__select__label">Block</span>
        <svg class="modal-array-editor-add__select__icon feather">
          <use xlink:href="#chevron-down"></use>
        </svg>
      </label>
    </template>
    <template slot="footer">
      <button class="modal__button modal__button--green" @click="addFunction(selected)">Add block</button>
      <button class="modal__button modal__button--default" @click="cancelFunction">Cancel</button>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "modal-array-editor-add",
  components: {
    Modal
  },
  props: ["selected", "options", "addFunction", "cancelFunction"],
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.modal-array-editor-add {
  &__select {
    @include form-select($this: &);
  }
}
</style>
