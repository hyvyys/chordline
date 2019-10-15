/* SPDX-License-Identifier: GPL-3.0-only */

<template>
  <div :class="{ 'keycap': true, 'optional': optional, 'space': value.toLowerCase() === 'space' }">
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true },
    optional: { type: Boolean, default: false },
  }
}
</script>

<style lang="scss" scoped>
.keycap {
  text-transform: capitalize;
  border-radius: 5px;
  padding: 2px 5px;
  margin: 0 1px;
  min-width: 1.75em;
  text-align: center;
  border: 1px solid #999;
  
  &.optional {
    margin: 0 7px;
    position: relative;
    &::before, &::after {
      position: absolute;
      top: 50%;
      padding: 0 2px;
      font-size: 2em;
      font-weight: 100;
      transform: translateY(-50%);
      opacity: 0.8;
    }
    &::before {
      content: '(';
      right: 100%;
    }
    &::after {
      content: ')';
      left: 100%;
    }
  }
}
</style>