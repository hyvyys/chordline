/* SPDX-License-Identifier: GPL-3.0-only */

import { findGuitarChord } from 'chord-fingering';

onmessage = function (event) {
  const { symbol, tuning, caseSensitive } = event.data;
  const chord = findGuitarChord(symbol, tuning, caseSensitive);
  postMessage(JSON.stringify(chord));
}