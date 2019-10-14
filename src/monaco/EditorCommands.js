import moveChord from "@/monaco/moveChord";
import mergeLines from "@/monaco/mergeLines";

export default {
  indentChord({ text, position, tabSize } = {}) {
    return this.moveChord({ text, position, tabSize, direction: 1, preserveOther: false })
  },
  outdentChord({ text, position, tabSize } = {}) {
    return this.moveChord({ text, position, tabSize, direction: -1, preserveOther: false })
  },
  moveChord,
  mergeLines
}
