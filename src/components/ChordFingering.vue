/* SPDX-License-Identifier: GPL-3.0-only */

<template>
  <div class="chord-fingering">
    <div class="panel">
      <div class="background"/>
      <ChordDiagram
        :chord="chordFingering"
        :tuning="tuning"
        :tuningPosition="-1"
        :openMutedPosition="2"
        :displayTuning="true"
        :displayOpenStrings="true"
      />
      <div class="chord-menu">
        <UiButton @click="$emit('play')" :disableRipple="true">
          <img svg-inline src="@/assets/icons/play-24px.svg" />
        </UiButton>
        <div class="position-string">
          <span>{{ chordFingering.positionString }}</span>
        </div>
        <UiButton v-clipboard:copy="definitionString" :disableRipple="true">
            <img svg-inline src="@/assets/icons/copy-24px.svg" />
        </UiButton>
      </div>
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

.chord-fingering {
  position: relative;
  margin-top: 0.5em;

  .panel {
    display: flex;
    flex-direction: column;
    .background {
      box-shadow: 2px 3px 10px 3px rgba(#888, 0.8);
      background: white;
    }
    .background, 
    .chord-menu {
      $r: $icon-size / 2;
      border-radius: $r 0 0 $r;
      overflow: hidden;
      position: absolute;
      top: -0.3em; 
      bottom: -0.3em; 
      left: 0;
      right: -4px;
    }
    .chord-menu {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .background, .chord-menu {
      opacity: 0;
      transition: opacity .8s;
    }
  }
}
.chord-fingering:hover {
  z-index: 2;
  .panel {
    .background, .chord-menu {
      transition: opacity .5s;
      opacity: 1;
    } 
  }
}

::v-deep .fret-number {
  transition: opacity 0.5s;
}
.chord-fingering:hover {
  ::v-deep .fret-number {
    opacity: 0;
  }
}

.chord-diagram {
  font-size: 14px;
  width: 10em;
  pointer-events: none;
}

.position-string {
  font-size: 0.6rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: $icon-size;
  z-index: 1;
  width: 0;
  flex: 0;
  
  position: relative;

  span {
    position: absolute;
    left: 0;
    transform: translateX(-50%);
  }
}

$chord-radius: 0em; //1em;
$c: lighten($dark-lighter, 25%);
$a: rgba($c, 0.5);
$b: rgba($c, 0.01);
$t: rgba($c, 0);

$icon-fg: $accent;
$icon-bg:white;
// $icon-fg-hover: white;
// $icon-bg-hover: $accent;
$icon-fg-active: white;
$icon-bg-active: $accent;

.chord-menu .ui-button {
  border-radius: $chord-radius;
  font-size: 0.7em;
  color: $dark-medium;
  height: 100%;
  
  width: auto;
  min-width: unset;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0;

  ::v-deep .ui-button__content {
    position: static;
    color: $icon-fg;
    // box-shadow: -5px 2px 15px rgba($icon-fg, 0.3);
    // background: $icon-bg;
    border-radius: 0;
    width: $icon-size;
    height: $icon-size;
    transition: all 1s;
    opacity: 0.85;
  }
  // &:hover ::v-deep .ui-button__content {
  //   background: rgba($icon-bg-hover, 0.9);
  //   color: $icon-fg-hover;
  // }
  &:active ::v-deep .ui-button__content {
    transition: all 0s;
    background: rgba($icon-bg-active, 0.9);
    color: $icon-fg-active;
  }


  $background-gain: 5%;
  $stop: 30%;
  $bg-size: 150%;
  $angle: 70deg;
  @mixin bg($deg, $color) {
    background: linear-gradient($deg, $color $background-gain, $b $stop, $t);
    // background-image: linear-gradient($deg, $color $background-gain, $b $stop, $t);
  }
  @mixin bg2($deg, $color) {
    background: linear-gradient($deg, $color $background-gain, $b $stop, $t);
    background-position: unset;
    background-size: unset;
    // background-image: linear-gradient($deg, $color $background-gain, $b $stop, $t);
  }

  position: relative;
  background: transparent;
  &:hover {
    color: $dark-lighter;
    background: transparent;
  }
  border-radius: $chord-radius;
  overflow: hidden;
  &::before {
    content: '';
    // z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: $bg-size;
    height: 101%;
    transition: transform 0.4s;
    background-size: 100%;
    background-position: -30% 100%;
  }
  ::v-deep .ui-ripple-ink .ui-ripple-ink__ink {
    opacity: 0.5;
  }

  &:first-child {
    &::before {
      @include bg($angle, $a);
      transform: translateX(-30%);
    }
    ::v-deep .ui-button__content {
      border-top-right-radius: 50%;
    }
    ::v-deep .ui-ripple-ink .ui-ripple-ink__ink {
      @include bg2($angle, $c);
    }
  }
  &:last-child {
    align-items: flex-end;
    ::v-deep .ui-button__content {
      // box-shadow: 5px 2px 15px rgba($icon-fg, 0.3);
      border-top-left-radius: 50%;
    }
    padding-right: 2px;
    &::before {
      left: unset;
      right: 0;
      width: $bg-size;
      @include bg(-$angle, $a);
      transform: translateX(30%);
    }
    ::v-deep .ui-ripple-ink .ui-ripple-ink__ink {
      background-position: 30% 100%;
      @include bg2(-$angle, $c);
    }
    &::before,
    ::v-deep .ui-ripple-ink .ui-ripple-ink__ink {
      background-size: 100%;
      background-position: 30% 100%;
    }
  }
  &:first-child:hover {
    &::before {
      transform: translateX(-0%);
    }
  }
  &:last-child:hover {
    &::before {
      transform: translateX(0%);
    }
  }
  &:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    }
  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>