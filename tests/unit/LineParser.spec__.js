const matchAll = require('string.prototype.matchall');
matchAll.shim();

import LineParser from '@/models/LineParser.js'


describe('LineParser', () => {
  it('keeps chord alignment when chord line is edited manually', () => {
    const testCases = [
      {
        oldText     : "A       m Esus4 C        Dsus2",
        newText     : "A      m Esus4 C        Dsus2",
        expectedText: "A      m  Esus4 C        Dsus2",
      },
      {
        oldText     : "Am Esus4    C        Dsus2",
        newText     : "Am   Esus4    C        Dsus2",
        expectedText: "Am   Esus4  C        Dsus2",
      },
      {
        oldText     : "Am   Esus4    C        Dsus2",
        newText     : " Am   Esus4    C        Dsus2",
        expectedText: " Am  Esus4    C        Dsus2",
      },
    ];
    testCases.forEach(testCase => {
      const { oldText, newText, expectedText } = testCase;
      const oldLines = LineParser.parse(oldText);
      const newLines = LineParser.parse(newText);
      
      // static applyTransform(oldLines, newLines, pasted = false)
      const actualLines = LineParser.applyTransform(oldLines, newLines);
      const actualText = actualLines.map(l => l.text).join("\n");
      
      expect(actualText).toBe(expectedText)
    });
  });
})
