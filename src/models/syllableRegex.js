/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

function syllableRegex() {
  const con = "[bcdfghjklmnpqrstvwxz'-]";
  const y = "[y]";
  const vow = "[aeiou]";
  const vowOrY = "[aeiouy]";
  const sep = "[ \\.,:;!?]|$";
  const wordSepOrConOrVow = `(?=${sep}|${con}|${vow})`;

  const regexText = `(?:${con}*${vowOrY}{1,3}|${con}{1,}${y}|${y}${vow}{1,3})` +
  `${con}*${wordSepOrConOrVow}`;

  return new RegExp(regexText, "ig");
}

export default syllableRegex();