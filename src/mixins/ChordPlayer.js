/* SPDX-License-Identifier: GPL-3.0-only */

import Soundfont from 'soundfont-player';
import { transpose } from "@tonaljs/tonal";
import { fromSemitones } from "@tonaljs/interval";
import ChordWorker from 'worker-loader!@/mixins/chord.worker.js';
// import Tokens from "@/models/Tokens";

export default {
  data() {
    return {
      chordWorker: null,

      chordSearchCaseSensitive: true,
      chordSearch: '',
      chordEntry: null,
      chordCache: {},

      tuning: null,
      tunings: [
        { label: 'Standard', value: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
        { label: 'Drop-D', value: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
        { label: 'Open-A', value: ['E2', 'A2', 'C#3', 'E3', 'A3', 'E4'] },
        { label: 'Open-B', value: ['B2', 'F#2', 'B3', 'F#3', 'B3', 'D#4'] },
        { label: 'Open-C', value: ['C2', 'G2', 'C3', 'G3', 'C3', 'E4'] },
        { label: 'Open-D', value: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'] },
        { label: 'Open-G', value: ['D2', 'G2', 'D3', 'B3', 'G3', 'D4'] },
      ],

      capo: null,
      capoOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
      ].map(i => ({ label: 'Capo ' + i, value: i, class: '' })),

      audioContext: null,
      instrument: {},
      instruments: [
        { name: "acoustic_guitar_steel", label: "Guitar steel" },
        { name: "acoustic_guitar_nylon", label: "Guitar nylon" },
        { name: "electric_guitar_jazz", label: "Guitar jazz" },
        { name: "acoustic_grand_piano", label: "Grand piano" },
        { name: "xylophone", label: "Xylophone" },
        // "accordion",
        // "sitar",
        // "string_ensemble_1",
        // "string_ensemble_2",
      ],
      soundfontPlayer: null,
      autoPlay: false,

      // avoid lag when navigating or typing chord symbols
      chordFingeringsTimeout: null,
      displayedChordFingerings: [],
      chordFingeringDisplayDelay: 300,
    }
  },

  computed: {
    chords() {
      const chords = this.chordCache[this.tuning.label];
      return chords ? chords : {};
    },
    chord() {
      return this.chordEntry ? this.chordEntry.chord : null;
    },
    chordFingerings() {
      return !this.chord ? [] : this.chord.fingerings.map(fingering => fingering);
    },
    selectedFingering() {
      const selectedFingering = this.chordEntry.selectedFingering;
      return this.chordFingerings[selectedFingering];
    },
  },

  watch: {
    chordSearch() {
      this.searchChord();
    },
    tuning() {
      this.searchChord();
    },
    instrument() {
      this.loadInstrument();
    },
    chordFingerings(val) {
      clearTimeout(this.chordFingeringsTimeout);
      this.chordFingeringsTimeout = setTimeout(() => {
        this.displayedChordFingerings = val.slice();
      }, this.chordFingeringDisplayDelay);
    },
  },
  
  created() {
    this.createWorker();
    this.capo = this.capoOptions[0];
    if (!this.instrument.name) this.instrument = this.instruments[0];
    if (!this.tuning) this.tuning = this.tunings[0];
    this.chordCache = {};
    this.tunings.forEach(t => this.chordCache[t.label] = {});
  },

  beforeDestroy() {
    this.chordWorker.terminate();
  },

  methods: {
    createWorker() {
      this.chordWorker = new ChordWorker();
      this.chordWorker.onmessage = (event) => {
        const chord = JSON.parse(event.data);
        if (chord) {
          const chordEntry = { chord, selectedFingering: 0 };
          this.chords[chord.input] = chordEntry;
          this.chordEntry = chordEntry;
        }
      };
    },

    searchChord() {
      const input = this.chordSearch;
      const chordEntry = this.chords[input];
      if (chordEntry) {
        this.chordEntry = chordEntry;
      }
      // else if (!Tokens.isChord(input, this.chordSearchCaseSensitive)) {
      //   return;
      // }
      else {
        const tuning = this.tuning.value;
        this.chordWorker.postMessage({ symbol: input, tuning, caseSensitive: this.chordSearchCaseSensitive });
      }
      
      if (this.autoPlay) {
        this.player.getPlayerState().then(state => {
          if (state !== 1) {
            this.playChord();
          }
        });
      }
    },

    onFingeringClicked(i) {
      this.selectFingering(i);
      this.playChord();
    },

    selectFingering(i) {
      if (this.chordEntry)
        this.chordEntry.selectedFingering = i;
    },

    loadInstrument() {
      const { name } = this.instrument;
      if (!this.audioContext) this.audioContext = new AudioContext();
      // const soundUrl = 'http://gleitz.github.io/midi-js-soundfonts/FatBoy/';
      const from = 'http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/';
      //soundfont: 'FluidR3_GM'
      Soundfont.instrument(this.audioContext, name, { from })
      .then((player) => {
        this.soundfontPlayer = player;
      });
    },

    playChord() {
      if (!this.soundfontPlayer || !this.chord) return;
      this.soundfontPlayer.stop();
      this.audioContext.resume().then(() => {
        const notes = this.selectedFingering.positions
          .map(p => p.note)
          .map(n => transpose(n, fromSemitones(this.capo.value)));

        const events = notes.map((note, i) => ({
          note,
          time: i * 0.075,
          duration: 2,
          // gain: 1 - i * 0.1,
          // attack: 0.01,
          // decay: 0.04,
          // sustain: 0.45,
          // release: 1.5,
        }));
        this.soundfontPlayer.schedule(this.audioContext.currentTime, events);
      });
    },
  },
}