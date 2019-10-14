const matchAll = require('string.prototype.matchall');
matchAll.shim();
const flatMap = require('array.prototype.flatmap');
flatMap.shim();

import getFingerings from '@/models/chord/fingerings';

describe('fingerings', () => {
  it('works for E5', () => {
    const notes = ["E", "B"];
    const fingerings = getFingerings({ name: "E5", notes, requiredNotes: notes, root: "E" });
    expect(fingerings.length).toBe(4);
  });
});