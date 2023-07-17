/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

<template>
  <div class="editor-footer">
    <KeyShorcutInfo v-for="(binding, i) in displayedKeybindings" :key="i"
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
  data() {
    return {
      isMacLike: true,
    };
  },
  computed: {
    displayedKeybindings() {
      return this.keybindings.filter(kb => this.isMacLike ? !kb.windows : !kb.macos);
    },
  },
  mounted() {
    this.isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
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