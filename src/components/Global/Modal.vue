<template>
  <section class="modal">
    <div class="modal__content">
      <div class="modal__header">
        <div class="modal__header__text">
          <slot name="header-text"></slot>
        </div>
        <button class="modal__header__close" @click="$emit('close');">
          <svg class="modal__header__close__icon feather">
            <use xlink:href="#x"/>
          </svg>
          <span class="modal__header__close__text">Close</span>
        </button>
      </div>
      <div class="modal__body">
        <slot name="content"></slot>
        <slot></slot>
      </div>
      
      <div class="modal__footer"><slot name="footer">
        <button class="modal__button modal__button--default" @click="$emit('ok');">Ok</button>
        <button class="modal__button modal__button--red" @click="$emit('cancel');">Cancel</button>
      </slot></div>
    </div>
  </section>
</template>

<script>

export default {
  name: "modal",
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import '../../scss/main';

@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: translate(-50%, -55%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.modal {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 3;

  &::before {
    background-color: $content-darken;
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  &__content {
    animation: modal-appear 0.15s linear forwards;
    box-shadow: $drop-shadow;
    left: 50%;    
    min-width: 50%;
    max-width: 80%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__header {
    background-color: $colour-grey-light;
    display: flex;
    justify-content: space-between;
    height: size(26px);

    &__text {
      @include column-gutters;
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: space-between;

      &,
      > * {
        @include default-font;
        @include font-size($font-size-xsmall);
        text-transform: uppercase;
      }
    }

    &__close {
      @include u-reset-button;
      display: block;
      height: 100%;
      margin-left: auto;
      padding: size(5px);
      width: size(46px);

      &:hover {
        background-color: $colour-red;
        color: $colour-white;
      }

      &__icon {
        display: block;
        max-height: 100%;
        max-width: 100%;
      }

      &__text {
        @include u-visually-hide;
      }
    }
  }

  &__body,
  &__footer {
    @include column-gutters;
    @include font-size($font-size-small);
    background-color: $colour-grey-mid;    
  }

  &__body {
    @include column-gutters;
    max-height: 80vh;
    overflow: auto;
    padding-bottom: $column-gutter-default * 1.5;
    padding-top: $column-gutter-default * 1.5;
  }

  &__footer {
    &:not(:empty) {
      border-top: 1px solid $colour-grey-light;
      padding-bottom: $column-gutter-default;
      padding-top: $column-gutter-default / 2;
    }
  }

  &__button {
    @include u-reset-button;
    background-color: $colour-blue;
    color: $colour-white;
    margin-top: $column-gutter-default / 2;
    padding: ($column-gutter-default / 2) ($column-gutter-default);
    text-decoration: none;
    text-transform: uppercase;

    &--red {
      background-color: $colour-red;
    }

    &--green {
      background-color: $colour-green;
    }

    &:not(:last-child) {
      margin-right: $column-gutter-default / 2;
    }
  }
}
</style>
