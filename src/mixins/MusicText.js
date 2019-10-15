/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

export default {
  methods: {
    formatNote(n) {
      return n
        .replace(/bb/, '𝄫')
        .replace(/b/, '♭')
        .replace(/##/, '𝄪')
        .replace(/#/, '♯');
    },
  }
}