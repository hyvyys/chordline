<template>
  <div class="app-content">
    <SiteHeader>
      <router-link to="/" class="home-link">♪ chordline</router-link>
      <router-link class='link-padded' to="/editor">Editor</router-link>
      <router-link class='link-padded' to="/lookup">Chord Lookup</router-link>
      <UiTextbox
        class="url-textbox"
        v-model="videoUrl"
        spellcheck="false"
        @focus="$event.target.select()"
      />
      <UiSelect class="instrument-select" :options="instruments" v-model="instrument" />
      <UiSelect class="capo-select" :options="capoOptions"  v-model="capo" />
      <UiSelect class="tuning-select" :options="tunings" v-model="tuning" />
      <UiCheckbox v-model="autoPlay" class="autoplay-checkbox">
        Autoplay
        <UiTooltip :openDelay="1000">
          Play chord under caret.
        </UiTooltip>
      </UiCheckbox>
    </SiteHeader>

    <main class="main">
      <div class="aside u-panel-parent">
        <div class="youtube">
          <youtube
            ref="youtube"
            :video-id="videoId"
            :fitParent="true"
            @ready="onYouTubeReady"
            @playing="onYouTubePlaying"
          />
        </div>

        <div class="song-timestamps u-panel-parent">
          <h3>Timestamps</h3>
          <div class="u-panel">
            <RemovableItem
              v-for="(stamp, i) in songTimestamps"
              :key="i"
              @remove="removeTimestamp(i)"
              class="song-timestamp"
            >
              <div class="song-timestamp-button" @click="seekTimestamp(i)">
                <span>
                  {{ `${formatTime(stamp.time)} at line ${ stamp.logicalPosition.lineNumber }` }}
                </span>
              </div>
            </RemovableItem>
          </div>
        </div>
      </div>

      <div class="monaco" ref="monacoEditor" />
      <!-- <MonacoEditor
        class="monaco"
        ref="editor"
        v-model="tabText"
        language="chordline"
        :options="monacoCreateOptions"
        @editorDidMount="editorDidMount"
        @editorWillMount="editorWillMount"
      /> -->

      <div class="right-sidebar u-panel-parent">
        <h3>Chord diagrams</h3>
        <label class='chord-name'>{{ chord && chord.symbol }}</label>
        <div class="chord-diagrams u-panel">
          <ChordFingering v-for="(chordFingering, i) in displayedChordFingerings" :key="i"
            :chordSymbol="chord.symbol"
            :chordFingering="chordFingering" 
            :tuning="tuning"
            @play="onFingeringClicked(i)"
          />
        </div>
      </div>
    </main>

    <div class="footer">
      <EditorFooter :keybindings="keybindings"  />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UiTextbox from "keen-ui/src/UiTextbox.vue";
import UiCheckbox from "keen-ui/src/UiCheckbox.vue";
import UiTooltip from "keen-ui/src/UiTooltip.vue";
import UiSelect from "keen-ui/src/UiSelect.vue";
import * as monaco from "monaco-editor";
import { getIdFromUrl } from "vue-youtube";

import ChordlineLanguage from "@/monaco/ChordlineLanguage";
import EditorCommands from "@/monaco/EditorCommands";
import LogicalLine from "@/models/LogicalLine";
import formatChordInput from "@/models/formatChordInput";
import SiteHeader from "@/components/SiteHeader.vue";
import RemovableItem from "@/components/RemovableItem.vue";

import ChordFingering from "@/components/ChordFingering.vue";
import watchIframeFocus from "@/utils/iframeFocus";
import { exampleVideoUrl, exampleTabText } from "@/example-data";

import EditorFooter from "@/components/EditorFooter";
import KeyBindings from "@/keybindings.js";

import ChordPlayer from "@/mixins/ChordPlayer.js";

export default {
  name: "editor",
  mixins: [
    ChordPlayer,
  ],
  components: {
    UiTextbox,
    UiCheckbox,
    UiTooltip,
    UiSelect,
    SiteHeader,
    RemovableItem,
    ChordFingering,
    EditorFooter,
  },
  data() {
    return {
      kb: null,
      keybindings: [],
      
      videoUrl: "",
      videoPlaying: false,
      ytNotFocused: true,
      rewindRate: 4,

      editor: null,
      editorFocused: false,
      caretPosition: { lineNumber: 0, column: 0 },
      prevCaretPosition: { lineNumber: 0, column: 0 },
      tabText: "",
      oldTabText: "",
      textChanged: false,
      songTimestamps: [],
      songTimestampsInitialized: false,
      tabStopLength: 6,
      selectChordTimeout: null,

      persistentFields: ["videoUrl", "tabText", "songTimestamps"]
    };
  },
  computed: {
    ...mapState(["disposableCompletionItemProvider"]),
    videoId() {
      return getIdFromUrl(this.videoUrl);
    },
    player() {
      return this.$refs.youtube.player;
    },
    playerFrame() {
      return document.querySelector(".youtube iframe");
    },
    monacoCreateOptions() {
      return {
        value: this.tabText,
        theme: "chordlineTheme",
        language: "chordline",
        automaticLayout: true,
        folding: true,
        lineNumbersMinChars: 3,
        minimap: {
          enabled: false,
          maxColumn: 60,
        },
        renderIndentGuides: false,
        rulers: [],
        scrollbar: {
          verticalHasArrows: true,
          verticalScrollbarSize: 17,
          verticalSliderSize: 11,
        },
        wordBasedSuggestions: false,
        wordSeparators: ' .,;:!?"&',
      };
    },
  },
  watch: {
    videoUrl() {
      this.persist("videoUrl");
    },
    tabText() {
      this.persist("tabText");
    },
    caretPosition() {
      this.selectChordAtCaret();
    },
    ytNotFocused() {
      this.refreshKeybindings();
    },
    editorFocused() {
      this.refreshKeybindings();
    }
  },
  created() {
    this.restore();
    this.loadExamples();
  },
  mounted() {
    this.createEditor();
    this.loadInstrument();
    this.kb = new KeyBindings();
    this.keybindings = this.kb.bind(this);
    this.refreshKeybindings();
  },
  beforeDestroy() {
    this.kb.unbind();
  },
  methods: {
    refreshKeybindings() {
      this.keybindings.forEach((b, i) => {
        const n = { ...b, active: b.conditions.every(c => this[c]) };
        this.$set(this.keybindings, i, n);
      });
    },
    selectChordAtCaret() {
      if (this.editor) {
        const model = this.editor.getModel();
        const word = model.getWordAtPosition(this.caretPosition);
        if (word) {
          this.chordSearch = word.word.trim();
        }
      }
    },

    loadExamples() {
      if (!this.videoUrl && !this.tabText) { 
        this.videoUrl = exampleVideoUrl;
        this.tabText = exampleTabText;
      }
    },

    // localStorage
    restore() {
      this.persistentFields.forEach(key => {
        if (localStorage[key]) {
          this[key] = JSON.parse(localStorage[key]);
        }
      });
    },
    persist(key) {
      (key ? [key] : this.persistentFields).forEach(k => {
        localStorage[k] = JSON.stringify(this[k]); 
      });
    },

    // Monaco Editor
    registerLanguage() {
      this.disposableCompletionItemProvider &&
        this.disposableCompletionItemProvider.dispose();
      let disposableCompletionItemProvider = ChordlineLanguage.register();
      this.$store.commit("storeDisposableCompletionItemProvider", {
        disposableCompletionItemProvider
      });
    },
    createEditor() {
      this.registerLanguage();

      this.editor = monaco.editor.create(this.$refs.monacoEditor, this.monacoCreateOptions);

      this.editor.onDidChangeCursorPosition(event => {
        this.prevCaretPosition = this.caretPosition;
        this.caretPosition = event.position;
      });
      // this.editor.onDidChangeCursorSelection(event => {
      //   this.prevCaretPosition = this.caretPosition;
      //   this.caretPosition = event.position;
      // });

      this.editor.onDidFocusEditorWidget(() => {
        this.editorFocused = true;
      });

      this.editor.onDidBlurEditorWidget(() => {
        this.editorFocused = false;
      });

      const model = this.editor.getModel();
      monaco.editor.setModelLanguage(model, "chordline")

      this.editor.updateOptions({
        insertSpaces: true,
        tabSize: 1, // I'll handle tabs myself, don't want any default indenting behavior
        useTabStops: false,
      });
      model.onDidChangeContent(event => {
        if (event.changes.length === 1 && event.changes[0].text.length === 1) {
          const editOperation = formatChordInput(this.tabText, event.changes[0]);
          if (editOperation) {
            this.pushEdit(editOperation);
          }
        }
        this.tabText = model.getValue();
        //.replace(/\t/g, ' ');
      });

      const changeCommandKeybinding = (id, keybinding = null) => {
        this.editor._standaloneKeybindingService.addDynamicKeybinding("-" + id);
        if (keybinding)
          this.editor._standaloneKeybindingService.addDynamicKeybinding(id, keybinding);
      }
      changeCommandKeybinding(
        "editor.action.triggerSuggest",
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_SLASH
      );
      changeCommandKeybinding("editor.action.outdentLines");
      changeCommandKeybinding("editor.action.indentLines");
      changeCommandKeybinding("indent");
      changeCommandKeybinding("outdent");
      changeCommandKeybinding("editor.action.toggleTabFocusMode");
      
      this.editor.addCommand(monaco.KeyCode.Tab, this.indentChord, '!suggestWidgetVisible');
      this.editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Tab, this.outdentChord);
      this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M, this.mergeLines);
    },
    indentChord() {
      let text = this.tabText;
      let position = this.caretPosition;
      const editOperation = EditorCommands.indentChord({ text, position });
      // this.updateText(newText, newPosition);
      this.pushEdit(editOperation);
    },
    outdentChord() {
      let text = this.tabText;
      let position = this.caretPosition;
      // const { newText, newPosition } = EditorCommands.outdentChord({ text, position });
      // this.updateText(newText, newPosition);
      const editOperation = EditorCommands.outdentChord({ text, position });
      this.pushEdit(editOperation);
    },
    mergeLines() {
      let textContent = this.tabText;
      let position = this.caretPosition;
      const editOperation = EditorCommands.mergeLines({ textContent, position });
      if (editOperation.text == null) {
        this.editor.getAction("editor.action.joinLines").run();
      }
      else {
        this.pushEdit(editOperation)
        // new Selection(selectionStartLineNumber: number, selectionStartColumn: number,
        // positionLineNumber: number, positionColumn: number)
        // const beforeCursorState = [
        //   new monaco.Selection(
        //     position.lineNumber, position.column,
        //     position.lineNumber, position.column
        //   )
        // ];
        // const cursorStateComputer = (editOperations) => {
        //   return beforeCursorState;
        // }
        // this.editor.getModel().pushEditOperations(
        //   beforeCursorState,
        //   [ editOperation ],
        //   cursorStateComputer,
        // );
        // this.updateText(newText, newPosition);
      }
    },
    pushEdit({ text, range }, newPosition) {
      if (!range) {
        range = this.editor.model.getFullModelRange();
      }
      if (!newPosition) {
        newPosition = { lineNumber: range.endLineNumber, column: range.startColumn + text.length };
      }
      const selection = this.editor.getSelection();
      const beforeCursorState = [ selection ];
       /* eslint-disable no-unused-vars */
      const cursorStateComputer = (inverseEditOperations) => {
        let newSelection = new monaco.Selection(
          newPosition.lineNumber,
          newPosition.column,
          newPosition.lineNumber,
          newPosition.column
        );
        return [newSelection];
      }
      //[ newPosition ] = 
      this.editor.getModel().pushEditOperations(
        beforeCursorState,
        [ { text, range } ],
        cursorStateComputer,
      );
      if (newPosition) {
        this.$nextTick(() => {
          this.editor.setPosition(newPosition);
        });
      }
    },
    updateText(text, position) {
      this.oldTabText = this.tabText;
      // this.tabText = text;
      this.editor.getModel().setValue(text);
      if (position) {
        this.$nextTick(() => {
          this.editor.setPosition(position);
        });
      }
    },

    // YouTube iframe player
    onYouTubeReady() {
      this.watchYouTubeFocus();
    },
    onYouTubePlaying() {
    },
    async watchYouTubeFocus() {
      const onFocus = () => (this.ytNotFocused = false);
      const onBlur = () => (this.ytNotFocused = true);
      watchIframeFocus(onFocus, onBlur);
    },
    async playPauseVideo() {
      if (!this.player)
        return;
      if ((await this.player.getPlayerState()) === 1) {
        // playing
        await this.player.pauseVideo();
      } else {
        await this.player.playVideo();
      }
    },
    async seekMinus() {
      if (!this.player)
        return;
      let time = await this.player.getCurrentTime();
      await this.player.seekTo(time - this.rewindRate);
    },
    async seekPlus() {
      if (!this.player)
        return;
      let time = await this.player.getCurrentTime();
      await this.player.seekTo(time + this.rewindRate);
    },
    async interpolateTimestamps() {
      const timestamps = this.songTimestamps,
        position = this.caretPosition.lineNumber;
      let a = timestamps[0],
        b = timestamps.slice(-1)[0];

      for (let i = 0; i < timestamps.length; i++) {
        const stamp = timestamps[i];
        if (stamp.position < position) a = stamp;
        if (stamp.position > position) {
          b = stamp;
          break;
        }
      }

      if (!b || a === b) {
        const duration = await this.player.getDuration();
        const lineCount = this.tabText.split(/\r?\n/g).length;
        b = {
          time: duration,
          position: { lineNumber: lineCount, column: 1 },
        };
        if (!a) a = {
          time: 0,
          position: { lineNumber: 1, column: 1 },
        };
      }

      const start = LogicalLine.caretToProgress(a.position, this.tabText);
      const end = LogicalLine.caretToProgress(b.position, this.tabText);
      const pos = LogicalLine.caretToProgress(this.caretPosition, this.tabText);
      let ratio = (pos - start) / (end - start);

      let time = a.time + (b.time - a.time) * ratio;
      return time;
    },
    async seekTimestamp(index) {
      if (!this.player)
        return;
      const timestamp = this.songTimestamps[index];
      const progress = LogicalLine.caretToProgress(timestamp.position, this.tabText);
      const position = LogicalLine.progressToCaret(progress, this.tabText);
      this.editor.setPosition(position);
      this.editor.revealLineInCenter(position.lineNumber);
      this.editor.focus();
      await this.player.seekTo(timestamp.time);
    },
    async seekCaret() {
      if (!this.player)
        return;
      const time = await this.interpolateTimestamps();
      await this.player.seekTo(time);
    },
    // refreshTimestamps(newText, oldText) {
      // TODO
    // },
    async addTimestamp(event, { time, position } = { }) {
      if (!this.player)
        return;
      if (time == null)
        time = await this.player.getCurrentTime();
      time = Math.round(time * 10) / 10;
      if (position == null)
        position = this.caretPosition;
      // remove close timestamps so as to replace them
      this.songTimestamps = this.songTimestamps
        .filter(b => Math.abs(b.time - time) > 1.75) // more than 1.75 seconds apart
        .filter(b => Math.abs(b.position.lineNumber - position.lineNumber) > 0); // 1 lines apart or more
      this.songTimestamps.push({ time, position, logicalPosition: LogicalLine.toLogical(position, this.tabText) });
      this.songTimestamps = this.songTimestamps.sort((l, k) => l.time - k.time);
      this.persist("songTimestamps");
    },
    removeTimestamp(i) {
      this.songTimestamps.splice(i, 1);
      this.persist("songTimestamps");
    },
    formatTime(seconds) {
      return (
        Math.floor(seconds / 60) +
        ":" +
        String(Math.round(seconds) % 60).padStart(2, "0")
      );
    },
  }
};
</script>

<style lang="scss" scoped>

.u-panel-parent {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.u-panel {
  max-height: 100%;
  padding: 4px;
  overflow: hidden auto;
  min-height: 0;
  flex: 1;
}
h3 {
  margin: 0;
  padding: 2px 6px;
  font-size: 0.8em;
  background: linear-gradient($dark-background, $dark-neutral);
  color: $dark-text;
  // box-shadow: 0 -2px 2px 2px rgba(#fff, 0.4) inset;
}


.chord-name {
  font-size: 1.2em;
  margin: 6px 6px 0;
}

.chord-diagrams {
  // flex: 0 0 auto;
  // padding: 
}

.monaco {
  // border: 2px solid $shade-color-darker;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 0px solid $shade-color-darker;
  border-left-width: 2px;
  border-right-width: 2px;

  .monaco-editor {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}

.song-timestamp {
  height: auto;
  .song-timestamp-button {
    flex: 1;
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
  &:hover {
    background: $light-hover;
  }
}

.youtube {
  width: 360px;
  height: 202.5px;
  overflow: hidden;
  flex: 0 0 auto;
}

.footer {
  width: 100%;
  background: $light-background;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 0 5px rgba(#000, 0.3);
  padding: 0.5em;
  z-index: 1;
  display: flex;
}

.key-shortcuts {
  display: flex;
  > * {
    margin: 0 10px;
  }
  transition: opacity 0.5s;
  &.hidden {
    opacity: 0.4;
  }
}

.caret-info {
  background: $shade-color;
  padding: 4px;
  border: 2px;
  min-width: 0;
  flex: 0 0 auto;
}
</style>
