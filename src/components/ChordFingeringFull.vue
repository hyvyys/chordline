<template>
  <div class="chord-fingering-full">
    <UiButton class="copy-button"
      color="secondary"
      v-clipboard:copy="definitionString"
    >
      <img svg-inline src="@/assets/icons/copy-24px.svg" />
      <span class="position-string">
        {{ chordFingering.positionString }}
      </span>
    </UiButton>
    <UiButton class="fingering"
      color="secondary"
      @click="$emit('play')"
    >
      <ChordDiagram
        :chord="chordFingering"
        :tuning="tuning"
        :tuningPosition="-1"
        :openMutedPosition="2"
        :displayTuning="true"
        :displayOpenStrings="true"
      />
    </UiButton>
    <div>
      {{ chordFingering.debug }}
    </div>
  </div>
</template>

<script>
import UiButton from "keen-ui/src/UiButton.vue";
import ChordDiagram from "@/components/ChordDiagram.vue";
export default {
  components: {
    UiButton,
    ChordDiagram,
  },
  props: {
    chordSymbol: { type: String, required: true },
    chordFingering: { type: Object, required: true },
    tuning: { type: Object, default: () => ({label: "EADGBe", value: '' }) },
  },
  computed: {
    definitionString() {
      return this.chordSymbol.padEnd(12, ' ') + this.chordFingering.positionString;
    }
  },
}
</script>

<style lang="scss" scoped>
$icon-size: 24px;

.chord-fingering-full {
  overflow: hidden;

  display: flex;
  flex-direction: column;
  border-radius: 10px;

  .ui-button {
    border-radius: 0;
    border-radius: 1px;
    text-transform: none;
    font-weight: normal;
    min-width: unset;
    padding: 0 .2rem;

    padding: 0;
    background: 0 100% / 200% 200%;
    background-color: rgba($light-background, 0.1);

    &:hover {
      background-color: rgba($accent, 0.1);
    }

    ::v-deep .ui-ripple-ink__ink {
      background-color: $accent;
    }
  }

  &:hover {
    box-shadow: 0 1px 6px $light-shadow;
    z-index: 1;
    .ui-button {
      @include shiny-glass();
    }
  } 
}

.fingering {
  max-height: unset;
  height: unset;
}
.chord-diagram {
  margin-top: 0.25em;
  font-size: 1rem;
  width: 10em;
  pointer-events: none;
}

.copy-button {
  height: 2rem;

  ::v-deep .ui-button__content {
    display: flex;
    flex: 1;
    width: 100%;
    padding: 0 0.25rem;
    svg {
      flex: 0 0 32px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    color: $text-subtle;
    &:hover {
      color: $text;
    }

    .position-string {
      display: block;
      flex: 1;
      align-self: flex-end;
      margin: 0 1em 0 0;
      padding-right: 0.5rem;
      font-size: 0.8rem;
      white-space: nowrap;
      text-align: center;
    }
  }
} 


.chord-fingering-full:hover {
  .copy-button ::v-deep .ui-button__content svg {
    opacity: 1;
  }
}
</style>