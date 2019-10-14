import { isSongPartLine } from '@/models/LineKind.js';

export default class SongPartFoldingRangeProvider {
  constructor(monaco) {
    this.monaco = monaco;
  }

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