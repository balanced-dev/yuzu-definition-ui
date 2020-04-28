<template>
  <div class="array-editor-actions">
    <a class="array-editor-actions__sort">
      <svg class="array-editor-actions__sort__icon feather">
        <use xlink:href="#more-vertical"/>
      </svg>
      <span class="array-editor-actions__sort__text">
        Sort
      </span>
    </a>            
    <a class="array-editor-actions__delete" @click="deleteFunction({item: item, path: relPath})">            
      <svg class="array-editor-actions__delete__icon feather">
        <use xlink:href="#x-square"/>
      </svg>
      <span class="array-editor-actions__delete__text">
        Delete
      </span>
    </a>
  </div>
</template>

<script>
export default {
  name: "json-data-array-actions",
  props: ["deleteFunction", "item", "relPath"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.array-editor-actions {
  $this: &;

  align-items: center;
  display: flex;
  padding-right: $column-gutter-default;

  &__sort {
    @include array-editor-button;
    background-color: $colour-blue;
    cursor: move; /* Fallback if grab cursor is unsupported */
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &__icon {
    }

    &__text {

    }      
  }

  &__delete {
    @include array-editor-button;
    background-color: $colour-red;

    &__icon {
    }

    &__text {

    }      
  }

}
</style>
