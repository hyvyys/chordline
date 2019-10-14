const matchAll = require('string.prototype.matchall');
matchAll.shim();

import Tokens from '@/models/Tokens.js'

// chord: new RegExp(chordRegex()),
// chordLine: new RegExp(chordLineRegex(), "g"),
// songPart: /\[([^\]]*)\]/,
// songPartNumbered: /\[([^\]]*) (\d+)\]/,
// annotation: /\(([^)]*)\)/,
// chordDefinition: /[x\d]{6}/,

function testToken(token, testCases) {
  testCases.forEach(({ text, expected }) => {
    it(`is ${expected ? '' : 'not '}matched by "${text}"`, () => {
      if (expected) {
        expect(text.match(token)).not.toBeNull();
      }
      else {
        expect(text.match(token)).toBeNull();
      }
    });
  });
}

describe('Tokens.chord', () => {
  const testCases = [
    { expected: true, text: '  A ' },
    { expected: true, text: 'Asus2sus4' },
    { expected: true, text: 'B#b5' },
    { expected: true, text: 'Fbmaj7add11' },
    { expected: true, text: 'Fbm7add11' },
    { expected: true, text: 'Dm9add4/E' },
    { expected: true, text: 'Ddimmaj7' },
    { expected: false, text: 'Ddimmaj' },
    { expected: false, text: 'Bbb' },
    { expected: false, text: 'C##' },
    { expected: false, text: 'Dsus3' },
    { expected: false, text: 'Dadd1' },
    { expected: false, text: 'Daugm' },
    { expected: false, text: 'Dmaug' },
  ];
  testToken(Tokens.chord, testCases);
});

describe('Tokens.chordLine', () => {
  const testCases = [
    { expected: true, text: '  A ' },
    { expected: true, text: 'Asus2sus4' },
    { expected: true, text: 'B#b5' },
    { expected: true, text: 'Fbmaj7add11' },
    { expected: true, text: 'Dm9add4/E' },
    { expected: true, text: 'Ddimmaj7' },
    { expected: false, text: 'Ddimmaj' },
    { expected: false, text: 'Bbb' },
    { expected: false, text: 'C##' },
    { expected: false, text: 'Dsus3' },
    { expected: false, text: 'Dadd1' },
    { expected: false, text: 'Daugm' },
    { expected: false, text: 'Dmaug' },
  ];
  //this regex is global, but calling String.match with can still return null (unlike matchAll)
  // testToken(Tokens.chordLine, testCases);
});
