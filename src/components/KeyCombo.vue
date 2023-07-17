/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

<template>
  <div class="key-combo">
    <span class="key-group" v-for="(group, j) in sequence" :key="j">
      <Keycap v-for="key in group" :key="key.keyName" :value="key.keyName" :optional="key.optional" />
    </span>
  </div>
</template>

<script>
import Keycap from "@/components/Keycap.vue";

export default {
  components: {
    Keycap,
  },
  props: {
    keys: { type: String, required: true },
  },
  computed: {
    sequence() {
      return this.keys.split('+')
        .map(str => str.split('|'))
        .map(group => group.map(k => /^\([^)]*\)$/.test(k)
            ? {optional: true, keyName: k.slice(1, -1)}
            : {optional: false, keyName: k}
          )
        );
    },
  },
}
</script>

<style lang="scss" scoped>
.key-combo {
  display: inline-flex;
}

.key-group {
  display: flex;
  position: relative;
  &:not(:last-child) {
    margin-right: 0.8em;
    &::after {
        content: '+';
      display: block;
      position: absolute;
      left: calc(100% + 0.4em);
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>