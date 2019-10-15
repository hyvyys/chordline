/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

import { isSongPartLine } from '@/models/LineKind.js';

export default class SongPartFoldingRangeProvider {
  constructor(monaco) {
    this.monaco = monaco;
  }

  // eslint-disable-next-line no-unused-vars
  provideFoldingRanges (model, context, token) {
    const lines = model.getLinesContent();
    const songPartIndices = lines
      .map((l, i) => ({ text: l, index: i + 1}))
      .filter(l => isSongPartLine(l.text))
      .map(l => l.index); 

    return songPartIndices.map((index, i, a) =>({
      start: index,
      end: (a[i + 1] || lines.length + 1) - 1,
      kind: this.monaco.languages.FoldingRangeKind.Region
    }));
  }
}