/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

import { isEmptyOrChordLine, isChordLine, isLyricLine } from "@/models/LineKind";

export default function mergeLines({ textContent, position }) {
  let text, range;
  const lines = textContent.split(/\r?\n/g);
  let i = position.lineNumber - 1;
  let cur = lines[i];
  let prev = lines[i - 1]
  let next = lines[i + 1];
  let next2 = lines[i + 2];

  if (isLyricLine(cur)
    && isEmptyOrChordLine(prev)
    && isEmptyOrChordLine(next)
  ) {
    /* E.g.:
      A          A#    B7        E        <= shift i here
      Lyrics one line, sing with          <= i points here
            A           A#   B7     E7
      me my darling, or else you'll see
    */
    i = i - 1;
  }
  else if (isChordLine(cur) && isLyricLine(next) && isLyricLine(next2)) {
    i = i + 1;
  }

  if (isEmptyOrChordLine(lines[i])
    && isLyricLine(lines[i + 1])
    && isEmptyOrChordLine(lines[i + 2])
    && isLyricLine(lines[i + 3])
  ) {
    let chord1 = lines[i],
    lyric1 = lines[i + 1],
    chord2 = lines[i + 2],
    lyric2 = lines[i + 3];
    chord1 = chord1.trimEnd();
    lyric1 = lyric1.trimEnd();
    chord2 = chord2.trimEnd();
    lyric2 = lyric2.trimEnd();

    range = {
      startLineNumber: i + 1,
      endLineNumber: i + 4,
      startColumn: 0,
      endColumn: lyric2.length + 1,
    }
      
    let diff = chord1.length - lyric1.length;
    let lyricPad = Math.max(diff, 0);
    let chordPad = Math.max(-diff, 0);
    lyric2 = decapitalize(lyric2);

    const sepChord = /,$/.test(lyric1) ? ' ' : '  ';
    const sepLyric = /,$/.test(lyric1) ? ' ' : ', ';

    let newLines = [
      chord1 + sepChord + ' '.repeat(chordPad) + chord2,
      lyric1 + sepLyric + ' '.repeat(lyricPad) + lyric2,
    ];
    lines.splice(i + 2, 2);
    text = newLines.join('\n');
  }
  else {
    let one = lines[i].trimEnd();
    let two = lines[i + 1].trimEnd();

    range = {
      startLineNumber: i + 1,
      endLineNumber: i + 2,
      startColumn: 0,
      endColumn: two.length + 1,
    }
    const sep = isLyricLine(one) && isLyricLine(two) ? (/,$/.test(one) ? ' ' : ', ' )
      : isChordLine(one) && isChordLine(two) ? '    '
      : '';
    two = isChordLine(two) ? two : decapitalize(two);
    text = one + sep + two;
  }
  // return ({ newText, newPosition });

  return { text, range };
}

function decapitalize(str) {
  return str.slice(0, 1).toLowerCase() + str.slice(1);
}