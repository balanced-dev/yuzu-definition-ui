<template>
  <label class="text-editor">
    <template v-if="label">
      <input class="text-editor__control text-editor__control--text" v-if="!isTextArea" v-on:focus="populateImages" v-on:blur="evaluateLength(item[label])" type="text" v-model="item[label]"  :list="isImageSrc ? uId : ''"/>
      <textarea class="text-editor__control text-editor__control--textarea" v-if="isTextArea" v-on:focus="populateImages" v-on:blur="evaluateLength(item[label])" v-model="item[label]" :list="isImageSrc ? uId : ''"></textarea>
      <span class="text-editor__label">
        {{ label }}
      </span>
      <datalist v-if="isImageSrc" :id="uId">
        <option :value="option" v-for="option in images" v-bind:key="option"></option>
      </datalist>
    </template>
    <template v-else>
      <input class="text-editor__control text-editor__control--text" type="text" v-model="item[index]" />
    </template>

    <svg class="text-editor__icon feather">
      <use xlink:href="#edit-2"/>
    </svg>
    <slot name="arrayActions"></slot>
  </label>
</template>

<script>
import api from '../../api';
export default {
  name: "json-data-text",
  data() {
    return {
      isImageSrc: false,
      uId: this.generateId(),
      isTextArea: false,
      images: []
    }
  },
  mounted() {
    this.evaluateLength();
    this.checkIfImageSrc();
  },
  methods: {
    checkIfImageSrc() {
      this.isImageSrc = this.label === 'src';
    },
    generateId() {
      return Math.random();
    },
    evaluateLength() {
      let value = String(this.item[this.label]), 
          charCount = value.length,
          wordCount = value.split(" ").length;
      this.isTextArea = wordCount >= 25 || charCount >= 150;
    },
    populateImages() {
      if(this.isImageSrc) {
        this.images = api.getImages().then((response) =>  {
          this.images = response.data;
        });
      }
    }
  },
  props: ["label", "index", "item", "depth", "path"]
};
</script>

<style scoped lang="scss">
@import '../../scss/main';

.text-editor {
  $this: &;

  @include form-input;

  &:hover:not(:focus-within) {
    #{$this}__icon {
      display: block;
    }
  }

  &__control {

    &--text {      
      min-height: size(50px);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--textarea {
      height: size(250px);
      overflow: auto;
      resize: none;
    }
  }

  &__label {
    line-height: 1;
    margin-bottom: size(5px);
    white-space: nowrap;
  }

  &__icon {
    background-color: $colour-grey-darker;
    color: $colour-blue;
    cursor: pointer;
    display: none;
    height: size(24px);
    padding: $column-gutter-default / 4;
    position: absolute;
    right: 0;
    top: 0;
    width: size(24px);
  }
  
}
</style>
