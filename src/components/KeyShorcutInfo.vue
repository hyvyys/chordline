/* SPDX-License-Identifier: GPL-3.0-only */ /* Copyright 2019 Adam Jagosz.
https://github.com/hyvyys/chordline */

<template>
  <div :class="{ 'key-shorcut-info': true, 'is-active': active }">
    <KeyCombo :keys="keys" />
    <div class="command">
      {{ command }}<span v-if="tooltip">&nbsp;[?]</span>
    </div>
    <UiTooltip v-if="tooltip" :openDelay="500">{{ tooltip }}</UiTooltip>
  </div>
</template>

<script>
import UiTooltip from 'keen-ui/src/UiTooltip.vue';
import KeyCombo from '@/components/KeyCombo.vue';

export default {
  components: {
    UiTooltip,
    KeyCombo,
  },
  props: {
    keys: { type: String, default: '' },
    command: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
};
</script>

<style lang="scss" scoped>
.key-shorcut-info {
  font-weight: 700;
  font-size: 9px;
  color: $text;
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: opacity 0.5s;
  &:not(.is-active) {
    opacity: 0.4;
  }

  .command {
    white-space: nowrap;
    margin-top: 3px;
    font-size: 11px;
    font-weight: 600;
  }
}
</style>
