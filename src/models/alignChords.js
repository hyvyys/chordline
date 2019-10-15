/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

/* TODO: use or remove */

/* eslint-disable no-unused-vars */
function tokenizeChordLine(line) {
  const tokens = [...line.matchAll(/(\S+|\s+)/g)].map(m => m[1]);
  if (!isGap(tokens[0])) {
    tokens.unshift('');
  }
  return tokens;
}

function isGap(s) {
  return /^(\s+|)$/.test(s);
}

export default function alignChords(lines, oldLines) {
  for (let i = 0, j = 0; i < lines.length; i++ , j++) {
    const current = lines[i], previous = lines[i - 1] || {}, next = lines[i + 1] || {};
    const currentOld = oldLines[j] || {}, previousOld = oldLines[j - 1] || {}, nextOld = oldLines[j + 1] || {};
    // if (current.text === currentOld.text) continue;

    if (current.isChordLine && current.text !== currentOld.text) {
      const a = current.text, b = currentOld.text;
      // console.log(a, b)

      const segments = tokenizeChordLine(a);
      const oldSegments = tokenizeChordLine(b);

      if (segments.length === oldSegments.length) {
        const lenDiff = segments.map((s, i) => s.length - oldSegments[i].length);

        segments.forEach((s, i) => {
          if (isGap(s)) {
            const nextGap = segments[i + 2];
            const diff = lenDiff[i];
            if (nextGap != null) {
              if (diff < 0) {
                const c = nextGap.length - diff;
                // console.log(`added ${c - nextGap.length} spaces to gap ${i + 2}`)
                segments[i + 2] = ' '.repeat(c);
              }
              else if (diff > 0) {
                const c = Math.max(1, nextGap.length - diff);
                // console.log(`removed ${- c + nextGap.length} spaces from gap ${i + 2}`)
                segments[i + 2] = ' '.repeat(c);
              }
            }
          }
          else {
            const nextGap = segments[i + 1];
            const diff = lenDiff[i];
            if (nextGap != null) {
              if (diff < 0) {
                const c = nextGap.length - diff;
                // console.log(`added ${c - nextGap.length} spaces to gap ${i + 2}`)
                segments[i + 1] = ' '.repeat(c);
              }
              else if (diff > 0) {
                const c = Math.max(1, nextGap.length - diff);
                // console.log(`removed ${- c + nextGap.length} spaces from gap ${i + 2}`)
                segments[i + 1] = ' '.repeat(c);
              }
            }
          }
        });
      }

      current.text = segments.join('');
    }
  }
}