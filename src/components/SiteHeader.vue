/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

<template>
  <div id="nav" class='site-header u-dark'>
    <slot />
  </div>
</template>

<style lang="scss"> 
@mixin input() {
  color: $dark-text !important;
  background: $dark-lighter;
  border-width: 2px !important;
  border-color: $dark-medium !important;
  transition: border-color 1s, background-color 1s;
  &:hover {
    transition: border-color 0.3s, background-color 0.3s;
    border-color: $dark-hover !important;
  }
}

@mixin input-focus() {
  border-color: $dark-active !important;
  background: $dark-lighter-active;
}

.site-header {
  background: $dark-background;
  color: $dark-text;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  // justify-content: flex-end;
  
  padding: 6px 12px;
  > :first-child {
    margin: 0 -12px;
  }
  > :not(:first-child) {
    margin: 4px 0;
  }
  > :not(:last-child) {
    margin-right: 1rem;
  }
  > :last-child {
    margin-right: -6px;
  }
  * {
    color: $dark-text;
  }
  @media (max-width: 768px) {
    .ui-textbox__input, .ui-select__display, .ui-checkbox__label-text, a {
      font-size: 12px;
    }
  }

  .home-link {   
    line-height: 1;
    padding: 0.15rem 0.75rem 0 1rem;
    font-size: 2em;
    font-family: Aromatron;
    font-size: 2.35em;
    @media (max-width: 768px) {
      font-size: min(calc(10vw - 8px), 2.35em);
    }
    text-decoration: none;
    color: $dark-text;
    white-space: nowrap;
  }
  
  .instrument-select {
    width: 8em;
  }
  .tuning-select {
    width: 6em;
  }

  .ui-checkbox {
    // margin-bottom: 0;
    overflow: hidden;
    // padding: 0.15rem 0;
  }
  
  .ui-textbox {
    // margin-bottom: 0;
    // margin: 0 1.25rem; 
    flex: 1;
    border-radius: 4px;
    overflow: hidden;
    color: $dark-text !important;

    @media (min-width: 1200px) {
      margin-left: .5rem;
    }
    
    .ui-textbox__label {
      flex-direction: row-reverse;
      align-items: center;
      .ui-textbox__label-text {
        color: $dark-text !important;
        white-space: nowrap;
        margin-right: 0.4rem;
        font-size: 0.8rem;
      }
    }
    
    .ui-textbox__input {
      @include input();
      width: 100%;
      max-width: unset;
      padding: 2px 4px;
      overflow: hidden;
      border-radius: 4px;
      border: solid;
      &:focus {
        @include input-focus();
      }
    }
  }

  .ui-select {
    // margin-bottom: 0;
    .ui-select__display {
      .ui-select__display-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px 0;
      }
      padding: 0 4px;
      overflow: hidden;
      border-radius: 4px;
      border: solid;
      @include input();
    }

    .ui-select__label:focus .ui-select__display,
    .ui-select__label.has-dropdown-open .ui-select__display {
      @include input-focus();
    }
  }

  .ui-checkbox__checkmark {
    height: 24px !important;
    width: 24px !important;
    overflow: hidden;
    background: transparent;
    &::before {
      background: $dark-lighter;
      height: 24px !important;
      width: 24px !important;
    }
    &::after {
      left: 8px !important;
      width: 8px !important;
      height: 16px !important;
    }
  }
  .ui-checkbox {
    &:not(.is-checked) .ui-checkbox__checkmark::before {
      border-color: $dark-medium !important;
    }
    &:hover .ui-checkbox__checkmark::before {
      border-color: $dark-hover !important;
    }
    input:focus + .ui-checkbox__checkmark::before {
      border-color: $dark-active !important;
    }
  }
}
</style>
