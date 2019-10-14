<template>
  <div class='chord-diagram'>
    <div class='fretboard-row' v-for="(string, i) in strings" :key="i">
      <div :class="{
          'string-name': true,
          'string-name--hidden': !displayTuning,
          'order-2': tuningPosition < -1,
          'order-1': tuningPosition < 0,
          'order1': tuningPosition > 0,
          'order2': tuningPosition > 1,
        }"
      >
        {{ formatNote(string) }}
      </div>
      <div :class="{
          'string-marker' :true,
          'open-marker': positionAtString(i) === 0,
          'muted-marker': positionAtString(i) === 'x',
          'open-marker--hidden': !displayOpenStrings,
          'order-2': openMutedPosition < -1,
          'order-1': openMutedPosition < 0,
          'order1': openMutedPosition > 0,
          'order2': openMutedPosition > 1,
        }">
      </div>
      <span
        v-for="fret in displayedPositions"
        :key="fret"
        :class="{ 'fretboard-cell': true, 'first': fret === 0}"
      >
        <div :class="{
          'pressed-marker': true,
          'is-over-barre': barre && barre.fret === fret,
          }"
          v-if="fret > 0 && positionAtString(i) === fret"
        >
          <div class="wrapper">
            <span :class="{ 'note-name': true, 'is-visible': displayNotes }">
              {{ noteAtString(i) }}
            </span>
          </div>
        </div>

        <div v-if="i === strings.length - 1 && barre && barre.fret === fret"
          :class="`barre ${barreClass}`">
        </div>

        <div v-if="i === strings.length - 1"
          :class="{
            'fret-number': true,
            'fret-number--hidden': minDisplayedPosition === 0,
            'fret-number--visible': alwaysShowFretNumbers,
          }"
        >
          {{ fret }}
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import MusicText from "@/mixins/MusicText";

export default {  
  mixins: [ MusicText ],
  props: {
    chord: { type: Object },
    tuning: { type: Object, default: () => ({label: "EADGBe", value: '' }) },
    maxFrets: { type: Number, default: 4 },
    displayTuning: { type: Boolean, default: true },
    displayOpenStrings: { type: Boolean, default: true },
    tuningPosition: { type: Number, default: 0 },
    openMutedPosition: { type: Number, default: 0 },
    alwaysShowFretNumbers: { type: Boolean, default: false },
    displayNotes: { type: Boolean, default: true },
  },
  computed: {
    strings() {
      const { value, label } = this.tuning;
      const strings = value && value.map(s => s.replace(/\d/g, ''))
        || label.split('');
      strings.forEach((s, i, a) => {
        const dupl = a.lastIndexOf(s);
        if (dupl > i) {
          strings[dupl] = a[dupl].toLowerCase();
        }
      });
      strings.reverse();
      return strings;
    },
    sortedPositions() {
      const sortedPositions = this.chord.positions.slice();
      sortedPositions.sort((a, b) => a.fret - b.fret);
      return sortedPositions;
    },
    minPosition() {
      return this.sortedPositions[0].fret;
    },
    maxPosition() {
      return this.sortedPositions.slice(-1)[0].fret;
    },
    minDisplayedPosition() {
      if (this.maxPosition <= this.maxFrets) {
        return 0;
      }
      else {
        return this.sortedPositions.filter(p => p.fret > 0)[0].fret;
      }
    },
    displayedPositions() {
      const frets = [];
      const min = this.minDisplayedPosition;
      const max = Math.max(min + (min === 0 ? 3 : 2), this.maxPosition);
      for (let i = min; i <= max; i++) {
        frets.push(i);
      }
      return frets;
    },
    barre() {
      return this.chord && this.chord.barre || null; 
    },
    barreClass() {
      if (this.barre) {
        const indices = this.barre.stringIndices;
        const from = Math.min(...indices);
        const to = Math.max(...indices);
        return `barre-${from}-${to}`;
      } 
      return '';
    },
  },
  methods: {
    positionAtString(stringIndex) {
      const index = this.strings.length - stringIndex - 1;
      const position = this.chord
        && this.chord.positions.find(p => p.stringIndex === index)
        || {};
      return position.fret != null ? position.fret : 'x';
    },
    noteAtString(stringIndex) {
      const index = this.strings.length - stringIndex - 1;
      const position = this.chord
        && this.chord.positions.find(p => p.stringIndex === index)
        || {};
      return position.fret > 0 && position.note != null
        ? this.formatNoteAtString(position.note)
        : '';
    },
    formatNoteAtString(n) {
      if (!this.displayNoteOctave) n = n.replace(/\d+/g, '');
      return this.formatNote(n);
    },
  }
}
</script>

<style lang="scss" scoped>
$dot-color: #743161;
$border-color: #888;
// $margin: 4px;
// $dot-size: 12px;
// $row-height: 14px;

$font-size-small: (4 / 5) * 1em;
$font-size-medium: (7 / 8) * 1em;
$row-height: 1.2em;
$margin: 0.1em;
$dot-size: 1.1em;
$barre-width: 0.9em;

.chord-diagram {
  padding: 0.5em 0;
}

.fretboard-row {
  display: flex;
  height: $row-height;
  margin: 0 0.1em;
}
.fretboard-cell {
  width: 2em;
  flex: 2em;
  border: 0px solid $border-color;
  border-right-width: 1px;
  border-top-width: 1px;
  position: relative;

  &:nth-of-type(1) {
    flex: 2em;
  }
  &:nth-of-type(2) {
    flex: 2.2em;
  }
  &:nth-of-type(3) {
    flex: 2.1em;
  }
  &:nth-of-type(3) {
    flex: 2em;
  }
  &:last-of-type {
    border-right-width: 1px;
    flex: 1.8em;
  }

  &.first {
    width: 0;
    border-right-width: 4px;
    flex: 0;
  }
}
.fretboard-row:last-child {
  .fretboard-cell {
    height: 0;
    .fret-number {
      font-size: $font-size-medium;
      position: absolute;
      top: 100%;
      left: 100%;
      padding: 0.2em;
      transform: translateX(-60%);
      &.fret-number--hidden {
        display: none;
      }
      &.fret-number--visible {
        display: block;
      }
    }
    &.first {
      .fret-number {
        transform: translateX(-40%);
      }
    }
  }
}

.string-name, 
.string-marker {
  transform: translate(0, -50%);
  height: $row-height;
  overflow: hidden;
  font-size: $font-size-small;
  line-height: $row-height;
  text-align: center;
  flex: 0 0 auto;
  text-shadow: 0 0 1px 1px white;

  &.order-1 {
    order: -1;
  }
  &.order1 {
    order: 1;
  }
  &.order-2 {
    order: -2;
  }
  &.order2 {
    order: 2;
  }
}
.string-name {
  width: 1.75em;
  &.string-name--hidden {
    display: none;
  }
}

.string-marker {
  width: 1.5em;
}

.open-marker,
.muted-marker {
  color: $border-color;
}
.muted-marker {
  &::after {
    content: '✕';
  }
}
.open-marker {
  &::after {
    content: '○';
  }
  &.open-marker--hidden {
    visibility: hidden;
  }
}

.pressed-marker {
  z-index: 1;
  width: $dot-size;
  height: $dot-size;
  position: absolute;
  top: 0;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(.is-over-barre) {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: relative;
      &::before {
        border-radius: 50%;
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: $dot-color;
        transform: rotate(45deg); // rotate to prevent sub pixel rounding squashing
      }
    }
  }

  .note-name.is-visible {
    font-size: 11px;
    opacity: 0.8;
    // transform: scaleX(0.75);
    display: block;
  }
}

.barre {
  background: $dot-color;
  width: $barre-width;
  left: 50%;
  position: absolute;
  transform: translate(-50%, 0);

  @for $i from 0 through 8 {
    @for $j from 0 through 8 {
      &.barre-#{$i}-#{$j} {
        bottom: ($i - 0.5) * $row-height;
        height: ($j - $i + 1) * $row-height;
        border-radius: $barre-width;
      }
    }
  }
}
</style>