/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

var keycode = require('keycode');

export default class Keybindings {
  
  constructor() {
    const rewindRate = 4;
    const defaultCondition = 'ytNotFocused';

    // bindings with `editorMethod` property will be bound, and the others will just be listed - they are registered with Monaco
    let bindings = [
      {
        keys: "ctrl+space",
        macosKeys: "meta+p",
        command: "Play/Pause song",
        editorMethod: "playPauseVideo",
      },
      {
        keys: "ctrl+,",
        displayKeys: "ctrl+<",
        macosKeys: "meta+[",
        macosDisplayKeys: "cmd+[",
        command: `Rewind ${rewindRate}s`,
        editorMethod: "seekMinus",
      },
      {
        keys: "ctrl+.",
        displayKeys: "ctrl+>",
        macosKeys: "meta+]",
        macosDisplayKeys: "cmd+]",
        command: `Forward ${rewindRate}s`,
        editorMethod: "seekPlus",
      },
      {
        keys: "ctrl+shift+b",
        macosKeys: "meta+shift+b",
        command: "Add timestamp",
        tooltip: "Remember current song position for current caret position in the lyrics.",
        editorMethod: "addTimestamp",
      },
      {
        keys: "ctrl+b",
        macosKeys: "meta+b",
        command: "Seek",
        tooltip: "Move song playback to current position in lyrics. Use added bookmarks to predict the correct position in song.",
        editorMethod: "seekCaret",
      },
      {
        keys: "ctrl+m",
        macosKeys: "meta+m",
        command: "Merge lines",
        tooltip: "Merge the lyrics and chords of current and next line.",
      },
      {
        condition: "editorFocused",
        keys: "(shift)+tab",
        command: "Align chord",
        tooltip: "Indent text under caret. Align chord to the next/previous syllable of lyrics in the next line, or the next/previous chord in the previous line.",
      },
      {
        condition: "editorFocused",
        keys: "alt+←|→",
        command: "Navigate words",
        tooltip: "Move cursor to previous/next word.",
      },
      {
        condition: "editorFocused",
        keys: "ctrl+alt+↑|↓",
        macosKeys: "meta+alt+shift+↑|↓",
        command: "Multiline cursor",
        tooltip: "Edit multiple lines at once, useful for aligning or tabs.",
      },
    ];

    const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

    this.bindings = bindings.map(b => {
      const conditions = [ defaultCondition ];
      if (b.condition) conditions.push(b.condition);
      return {
        ...b,
        keys: isMacLike ? b.macosKeys || b.keys : b.keys,
        displayKeys: isMacLike ? b.macosDisplayKeys || b.displayKeys : b.displayKeys,
        conditions,
      };
    });
  }
  
  bind(editor) {
    const modifiers = ['ctrl','shift','alt','meta'];

    this.bindings.forEach(b => {
      if (b.editorMethod) {
        const keys = b.keys.split('+');
        const key = keys.filter(k => !modifiers.includes(k))[0];
        const mods = keys.filter(k => modifiers.includes(k));
        const which = keycode(key);

        const handler = e => {
          if (e.which === which && modifiers.every(m => e[m + 'Key'] === mods.includes(m))) {
            e.preventDefault();
            editor[b.editorMethod]();
          }
        };
        b.handler = handler;
        if (!b.event) b.event = 'keydown';

        document.addEventListener(b.event, b.handler, true);
      }
    });
    return this.bindings;
  }

  unbind() {
    this.bindings.forEach(b => {
      // when removing listener, useCapture must be the same as when adding! lesson learned.
      document.removeEventListener(b.event, b.handler, true);
    });
  }
}