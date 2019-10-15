/* SPDX-License-Identifier: GPL-3.0-only */

<template>
  <div class="editor-footer">
    <KeyShorcutInfo v-for="(binding, i) in keybindings" :key="i"
      :keys="binding.displayKeys || binding.keys"
      :command="binding.command"
      :tooltip="binding.tooltip"
      :active="binding.active"
    />
  </div>
</template>

<script>
import KeyShorcutInfo from "@/components/KeyShorcutInfo.vue";

export default {
  components: {
    KeyShorcutInfo,
  },
  props: {
    keybindings: { type: Array, default: () => [] },
  },
  computed: {
  },
}
</script>

<style lang="scss" scoped>

.editor-footer {
  display: flex;
  justify-content: flex-start;
  > * {
    margin: 0 10px;
  }
}
</style>