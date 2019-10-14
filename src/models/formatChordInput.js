import * as monaco from "monaco-editor";
import { isEmptyOrChordLine, isChordLine } from "@/models/LineKind";

export default function formatChordInput(tabText, change) {
  // tabText is old text, without the just typed letter
  let { text, range } = change;
  let y = range.startLineNumber - 1, x = range.startColumn - 1;
  const line = tabText.split(/\r?\n/g)[y];  // Firefox leaves the \r in place, Chrome removes it when splitting on just "\n"
  if (!isEmptyOrChordLine(line)) {
    return;
  }

  const prefix = line.slice(0, Math.max(x, 0));
  const suffix = line.slice(Math.min(x, line.length), line.length);

  const transforms = [
    {
      newText: text.toUpperCase(),
      condition: /(^| )$/.test(prefix) && /^( |$)/.test(suffix),
    },
    {
      newText: text.replace('3', '#'),
      condition: /[A-G]$/.test(prefix) && /^( |$)/.test(suffix),
    },
  ];

  const proposeTransform = ({ newText, condition }) => {
    if (newText === text || !condition)
      return;
    const newLine = line.slice(0, x) + newText + line.slice(x);
    if (isChordLine(newLine)) {
      let range = new monaco.Selection(y + 1, x + 1, y + 1, x + 2);
      const editOperation = { text: newText, range };
      return editOperation;
    }
    return null;
  }
  
  for (let i = 0; i < transforms.length; i++) {
    const editOperation = proposeTransform(transforms[i]);
    if (editOperation) {
      return editOperation;
    }
  }
  return null;
}