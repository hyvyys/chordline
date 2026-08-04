/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

import { isEmptyOrChordLine, isLyricLine } from '@/models/LineKind';

export default function splitLines({ textContent, position }) {
  let text, range;
  const lines = textContent.split(/\r?\n/g);
  let i = position.lineNumber - 1;
  let cur = lines[i];
  let prev = lines[i - 1];

  if (isLyricLine(cur) && isEmptyOrChordLine(prev)) {
    /* E.g.:
      A          A#    B7        E        <= shift i here
      Lyrics one line, sing with          <= i points here
    */
    i = i - 1;
  }

  const chordLine = lines[i];
  const lyricLine = lines[i + 1];

  function findPreviousSpace(line) {
    let col = position.column;

    if (line[col - 1] != ' ') {
      const spaceIndex = line
        .split('')
        .reverse()
        .join('')
        .slice(line.length - position.column)
        .indexOf(' ');

      if (spaceIndex > -1) {
        col = position.column - spaceIndex;
      } else {
        const spaceIndex = line.slice(position.column).indexOf(' ');
        if (spaceIndex > -1) {
          col = position.column + spaceIndex;
        }
      }
    }

    return col;
  }

  if (isEmptyOrChordLine(chordLine) && isLyricLine(lyricLine)) {
    let chordsCol = findPreviousSpace(chordLine);
    let lyricsCol = findPreviousSpace(lyricLine);
    let chordsPad = Math.max(0, -lyricsCol + chordsCol);
    let lyricsPad = Math.max(0, lyricsCol - chordsCol);

    text = [
      chordLine.slice(0, chordsCol).replace(/ *$/, ''),
      lyricLine.slice(0, lyricsCol).replace(/ *$/, '').replace(/,$/, ''),
      ' '.repeat(chordsPad) + chordLine.slice(chordsCol).replace(/ *$/, ''),
      ' '.repeat(lyricsPad) + capitalize(lyricLine.slice(lyricsCol)).replace(/ *$/, ''),
    ].join('\n');

    range = {
      startLineNumber: i + 1,
      endLineNumber: i + 2,
      startColumn: 0,
      endColumn: lines[i + 1].length + 1,
    };
  }

  return { text, range };
}

function capitalize(str) {
  const index = str.split('').findIndex((c) => c != ' ') + 1;

  return str.slice(0, index).toUpperCase() + str.slice(index);
}
