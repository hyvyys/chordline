import { isLyricLine, isChordLine, isEmptyLine } from './LineKind.js';

export default {
  isLogicalLine(line, next, prev) {
    return isChordLine(line)
      || isEmptyLine(line) && isLyricLine(next)
      || isLyricLine(line) && !isChordLine(prev);
  },

  caretToProgress(position, text) {
    let lines = text.split(/\r?\n/g);
    let songProgress = position.lineNumber;

    for (let i = 0; i < lines.length && i < position.lineNumber; i++) {
      const line = lines[i], next = lines[i + 1], prev = lines[i - 1];
      const lineMovesProgress = this.isLogicalLine(line, next, prev);
      // console.log({line, lineMovesProgress})
      if (!lineMovesProgress) {
        songProgress--;
      }
    }
    return songProgress || 1;
  },

  progressToCaret(progress, text) {
    let lines = text.split(/\r?\n/g);
    let lineNumber = progress;
    for (let i = 0; i < lines.length && i < lineNumber; i++) {
      const line = lines[i], next = lines[i + 1], prev = lines[i - 1];
      const lineMovesProgress = this.isLogicalLine(line, next, prev);
      if (!lineMovesProgress) {
        lineNumber++;
      }
    }
    return { lineNumber, column: 1 };
  },

  toLogical(position, text) {
    return this.progressToCaret(this.caretToProgress(position, text), text);
  }
}