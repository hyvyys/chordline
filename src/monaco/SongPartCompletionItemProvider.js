import * as monaco from "monaco-editor";
import { isEmptyOrChordLine } from "@/models/LineKind";
import Tokens from '@/models/Tokens.js';
import { isChordLine } from "../models/LineKind";

export default class SongPartCompletionItemProvider {
  constructor() {
    this.triggerCharacters = '[ABCDEFGHN';
  }

  provideCompletionItems(model, position) {
    // const characterBefore = model.getValueInRange({
    //   startLineNumber: position.lineNumber,
    //   startColumn: Math.max(1, position.column - 1),
    //   endLineNumber: position.lineNumber,
    //   endColumn: position.column
    // });
    const curLine = model.getLineContent(position.lineNumber);
    const prefix = curLine.slice(0, position.column - 1);
    const suffix = curLine.slice(position.column - 1);

    
    let suggestedKeywords = [];
    if (/^\[/.test(prefix)) {
      suggestedKeywords = suggestSongParts(model, position);
    }
    else {
      const unfinishedNoChordSymbol = /(n(?!\.c\.)|n\.(?!c.)|n\.c(?!\.))(?= |$)/ig;
      const oldLine = curLine.replace(unfinishedNoChordSymbol, '');
      const canBeChordLine = isEmptyOrChordLine(oldLine);

      if (canBeChordLine && /^( |$)/.test(suffix)) {
        const lines = model.getValue().split(/\r?\n/g);
        lines[position.lineNumber - 1] = oldLine;
        suggestedKeywords = suggestChordNames(lines, position);
        
        // don't suggest the only matching chord - it has already been typed!
        const word = model.getWordAtPosition(position).word;
        if (Tokens.isChord(word)) {
          const matchingSuggestions = suggestedKeywords.filter(k => k.startsWith(word));
          if (matchingSuggestions.length === 1)
            suggestedKeywords = [];
        }
      }
    }

    const suggestions = suggestedKeywords.map((p, i) => ({
      label: p,
      insertText: p,
      sortText: String(i).padStart(2, '0'),
      kind: monaco.languages.CompletionItemKind.Text,
    }));

    return  { suggestions };
  }
}

function suggestSongParts(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 0,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column
  });

  const lines = textUntilPosition.split(/\r?\n/g);
  const parts = lines
    .filter(l => Tokens.songPart.test(l))
    .reduce((acc, part) => {
      let [, name] = part.match(Tokens.songPart);
      let numbered = part.match(Tokens.songPartNumbered);
      if (numbered) {
        name = numbered[1];
      }
      acc[name] = true;
      return acc;
    }, {});

  const partCounts = lines
    .filter(l => Tokens.songPartNumbered.test(l))
    .reduce((acc, part) => {
      let [, name, count] = part.match(Tokens.songPartNumbered);
      count = parseInt(count);
      if ((acc[name] || 0) < count) acc[name] = count;
      return acc;
    }, {});

  if (Object.keys(partCounts).length === 0)
    partCounts['Verse'] = 0;

  const availableParts = [
    ...Object.keys(partCounts).map(name => `${name} ${partCounts[name] + 1}`),
    ...['Intro'].filter(p => !parts[p]),
    'Verse',
    'Pre-Chorus',
    'Chorus',
    'Post-Chorus',
    'Bridge',
    ...['Outro'].filter(p => !parts[p]),
    'Interlude',
    'Instrumental',
    'Solo',
    'Refrain',
    'Breakdown',
    'Coda',
    'Break',
  ].map(p => `[${p}]`);

  return availableParts;
}

// eslint-disable-next-line no-unused-vars
function suggestChordNames(lines, position) {
  const chordLines = lines.filter(l => isChordLine(l));
  const chords = Array.from(
    new Set(chordLines.flatMap(l => l.trim().split(/ +/g)))
  );
  return chords;
}