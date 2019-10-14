import * as monaco from "monaco-editor";
import { isEmptyOrChordLine, isChordLine, isLyricLine } from "@/models/LineKind";
import syllableRegex from "../models/syllableRegex";

export default function moveChord({ text, position, direction, preserveOther, tabSize, alignToSyllable } = {}) {
  if (alignToSyllable == null) alignToSyllable = true;
  const { lineNumber, column } = position; // 1-based, not zero
  const lineIndex = lineNumber - 1, columnIndex = column - 1;
  const lines = text.split(/\r?\n/g);
  const next = lines[lineIndex + 1];
  const prev = lines[lineIndex - 1];
  const line = lines[lineIndex];
  let editOperation;
  
  const leadingSpace = line.slice(columnIndex).match(/^ */)[0].length;
  const chordColumn = column + leadingSpace;
  const chordColumnIndex = chordColumn - 1;

  let delta = tabSize || 4;
  if (isEmptyOrChordLine(line)) {
    let referenceLine;
    if (next && isLyricLine(next)) {
      referenceLine = next;
    } 
    else if (prev && isChordLine(prev)) {
      referenceLine = prev;
      alignToSyllable = false;
    }
    if (referenceLine) {
      const slice = direction > 0
        ? referenceLine.slice(columnIndex)
        : referenceLine.slice(0, chordColumnIndex).padEnd(chordColumnIndex, ' ');

      const wordRegex = /[^ ]+(?= |$)/g;
      const regex = alignToSyllable ? syllableRegex : wordRegex;

      const stripped = slice.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[ØøÆæ]/g, "o")
        .replace(/[^a-zA-Z ]/g, "z"); // fixes non-decomposable letters like "ł"
      const matches = Array.from(stripped.matchAll(regex));
      if (matches.length) {
        if (direction > 0) {
          // if first match is at caret position, take next so caret moves
          const index = matches[0].index || matches[1] && matches[1].index;
          if (index) delta = index;
        }
        else {
          const index = matches.slice(-1)[0].index ||
            matches.slice(-2)[1] && matches.slice(-2)[1].index;
          if (index) delta = columnIndex - index;
        }
      }
    }
  }
  
  if (direction > 0) {
    // kind of like:
    // line = line.slice(0, columnIndex) + ' '.repeat(delta) + line.slice(chordColumnIndex);
    const text = ' '.repeat(delta)
    const range = new monaco.Selection(lineNumber, column, lineNumber, chordColumn);
    editOperation = { text, range };
  }
  else {
    const match = line.slice(0, columnIndex).split('').reverse().join('').match(/^ +(?= |$)/);
    const maxDelta = match ? match[0].length : 0;
    delta = Math.min(maxDelta, delta);
    const index = columnIndex - delta;
    // kind of like:
    // line = line.slice(0, index) + line.slice(chordColumnIndex);
    const range = new monaco.Selection(lineNumber, index + 1, lineNumber, chordColumn);
    editOperation = { text: '', range };
  }
  // effectively like:
  // const newText = lines.join('\n');
  // const newPosition = { lineNumber, column: column + direction * delta };
  return editOperation;
}