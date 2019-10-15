/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

import Tokens from '@/models/Tokens.js';
import SongPartCompletionItemProvider from "@/monaco/SongPartCompletionItemProvider";
import SongPartFoldingRangeProvider from "@/monaco/SongPartFoldingRangeProvider";

import * as monaco from "monaco-editor";

export default {
  register() {
    // Register a new language
    monaco.languages.register({ id: 'chordline' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('chordline', {
      tokenizer: {
        root: [
          [Tokens.chordLine_g, "chordLine"],
          // [Tokens.chord, "chord"],
          [Tokens.songPart, "songPart"],
          [Tokens.annotation, "annotation"],
          [Tokens.chordDefinition, "chordDefinition"],
        ]
      }
    });
    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('chordlineTheme', {
      base: 'vs',
      inherit: false,
      colors: {
        "editor.background": "#f5eff7",
        "editor.selectionBackground": "#9a4a9c66",
        // "editor.foreground": "#ff0000",
        // "editorCursor.foreground": "#000000",
        // "editorWhitespace.foreground": "#BFBFBF",
        // 'editorIndentGuides': '#D3D3D3',
        // 'editorActiveIndentGuides': '#939393',
        // "editor.highlightBackground": "#9a4a9c88",
        // 'editor.inactiveSelectionBackground': '#ff000066',
        // 'editor.selectionHighlight': '#00ff0066',
      },
      rules: [
        { token: 'chordLine', foreground: '237893', fontStyle: 'bold' },
        // { token: 'chord', foreground: '237893', fontStyle: 'bold' },
        { token: 'songPart', foreground: '925c38', fontStyle: 'bold' },
        { token: 'annotation', foreground: '778285', fontStyle: 'italic' },
        { token: 'chordDefinition', foreground: '778285' },
      ]
    });

    monaco.languages.setLanguageConfiguration('chordline', {
      // autoCloseBefore
      autoClosingPairs: [
        // { open: '(', close: ')' },
        // { open: '[', close: ']' },
      ],
      // brackets
      // comments
      folding: {
        markers: {
          start: new RegExp('^\\['),
          end: new RegExp(`^\\[`)
        }
      },
      // indentationRules
      // onEnterRules
      // surroundingPairs
      // wordPattern: /(-?\d.\d\w)|([^`~!@#%^&*()-=+[{]}\|;:'",.<>\/?\s]+)/g, // default - incorrect btw, from docs
      // wordPattern: /(-?\d.\d\w)|(\[[A-Za-z-]+ ?\d*\])|([^`~!@%^&*()-=+[{\]}|;:'",.<>/?\s]+)/g,
      // wordPattern: /(\[[A-Za-z-]+ ?\d*\])|([^\s]+ *(?= |$))/g,
      wordPattern: /(\[[A-Za-z-]+ ?\d*\])|([^\s]+)/g,
    });

    monaco.languages.registerFoldingRangeProvider("chordline", new SongPartFoldingRangeProvider(monaco));

    const disposableCompletionItemProvider =
      monaco.languages.registerCompletionItemProvider('chordline', new SongPartCompletionItemProvider(monaco));

    return disposableCompletionItemProvider;
  }
}