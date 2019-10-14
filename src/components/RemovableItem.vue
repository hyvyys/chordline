<template>
  <div class="removable-item">
    <div class="content">
      <slot />
    </div>
    <UiIconButton @click="$emit('remove')" type="secondary" size="small">
      <img svg-inline src="@/assets/icons/remove.svg" />
    </UiIconButton>
  </div>
</template>

<script>
import { UiIconButton } from 'keen-ui';

export default {
  components: {
    UiIconButton,
  },
}
</script>

<style lang="scss" scoped>
.removable-item {
  display: flex;

  .content {
    flex: 1;
    display: flex;
  }

  .ui-icon-button {
    margin: 2px;
  }
}
</style>