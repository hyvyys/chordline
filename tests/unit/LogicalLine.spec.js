const matchAll = require('string.prototype.matchall');
matchAll.shim();

import LogicalLine from "@/models/LogicalLine";

const textLyricsSongParts = `[Intro]


[Verse 1]
Știu cât am greșit
Am greșit iubind
Sumbre zări frământ
Mări cosesc vâslind
În ape din regrete
Năvodar vestit
Drumuri lazarete
M-au înămolit.


[Verse 2]
Inimă mai am

`;

const textLyricsSongPartsChords = `[Verse 1]
C  D
Știu cât am greșit
B  C
Am greșit iubind
B  C
Sumbre zări frământ
B  C
Mări cosesc vâslind
`;

const textChords = `



C  D

B  C
B  C

B  C

(end)
`;



describe('LogicalLine.caretToProgress', () => {
  it(`works for lyrics with song parts without chords`, () => {
    const position = { lineNumber: 6, column: 1 };
    const value = LogicalLine.caretToProgress(position, textLyricsSongParts);
    expect(value).toBe(2);
  });
  it(`works for lyrics with chords`, () => {
    const position = { lineNumber: 7, column: 1 };
    const value = LogicalLine.caretToProgress(position, textLyricsSongPartsChords);
    expect(value).toBe(3);
  });
  it(`works for chords with empty lines between`, () => {
    const position = { lineNumber: 8, column: 1 };
    const value = LogicalLine.caretToProgress(position, textChords);
    expect(value).toBe(3);
  });
  it(`works for chords with empty lines after`, () => {
    const position = { lineNumber: 11, column: 1 };
    const value = LogicalLine.caretToProgress(position, textChords);
    expect(value).toBe(4);
  });
  it(`works for chords with annotation lines after`, () => {
    const position = { lineNumber: 12, column: 1 };
    const value = LogicalLine.caretToProgress(position, textChords);
    expect(value).toBe(4);
  });
  it(`works for chords with empty and annotation lines after`, () => {
    const position = { lineNumber: 13, column: 1 };
    const value = LogicalLine.caretToProgress(position, textChords);
    expect(value).toBe(4);
  });
});

describe('LogicalLine.progressToCaret', () => {
  it(`works for lyrics with song parts without chords`, () => {
    const value = LogicalLine.progressToCaret(2, textLyricsSongParts);
    expect(value.lineNumber).toBe(6);
  });
  it(`works for lyrics with chords`, () => {
    const value = LogicalLine.progressToCaret(2, textLyricsSongPartsChords);
    expect(value.lineNumber).toBe(4);
  });
  it(`works for chords with empty lines in between`, () => {
    let value = LogicalLine.progressToCaret(4, textChords);
    expect(value.lineNumber).toBe(10);
  });
});


describe('LogicalLine.toLogical', () => {
  it(`works for lyrics with song parts without chords`, () => {
    const position = { lineNumber: 1, column: 1 };
    const value = LogicalLine.toLogical(position, textLyricsSongParts);
    expect(value.lineNumber).toBe(5);
  });
  // it(`works for lyrics with song parts without chords`, () => {
  //   const position = { lineNumber: 1, column: 1 };
  //   const value = LogicalLine.toLogical(position, textLyricsSongPartsChords);
  //   expect(value.lineNumber).toBe(2);
  // });
  // it(`works for chords alone`, () => {
  //   const lineNumber = textChords.split(/\r?\n/g).length;
  //   const position = { lineNumber, column: 1 };
  //   const value = LogicalLine.toLogical(position, textChords);
  //   expect(value.lineNumber).toBe(4);
  // });
});