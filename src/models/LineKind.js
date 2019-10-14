import Tokens from './Tokens.js';

export function isChordLine(line) {
  // return line && new RegExp('^' + Tokens.chordLine.source + '$').test(line.trim());
  // console.log(JSON.stringify(Tokens.chordLine.source));
  // console.trace(line)
  return line && Tokens.chordLine.test(line.trim());
}
export function isChordDefinitionLine(line) {
  return line && new RegExp('^' + Tokens.chord.source + ' +' + Tokens.chordDefinition.source + '$').test(line.trim());
}
export function isAnnotationLine(line) {
  return line && new RegExp('^' + Tokens.annotation.source + '$').test(line.trim());
}
export function isEmptyLine(line) {
  return line != null && /^\s*$/.test(line.trim());
}
export function isEmptyOrChordLine(line) {
  return isEmptyLine(line) || isChordLine(line);
}
export function isSongPartLine(line) {
  return line && new RegExp('^' + Tokens.songPart.source + '$').test(line.trim());
}
export function isLyricLine(line) {
  return line && !(
    isChordLine(line) ||
    isChordDefinitionLine(line) ||
    isAnnotationLine(line) ||
    isEmptyLine(line) ||
    isSongPartLine(line)
  ) || false;
}