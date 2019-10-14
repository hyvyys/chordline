function chordRegex() {
  const note = '[A-G][b#]?';
  const altered = `(?:5|dim(5|7)?|aug5?|\\+5?|-5?)`;
  const minor = '(?:mi?n?)';
  const major = '(?:maj?|Ma?j?)';
  const majorableExt = `(?:6|7|9|11|13)`;
  const ext = `(?:2|4|6|7|9|11|13|6\\/9)`;
  const _mod = '(?:[b-](5|6|9|13)|[#+](4|5|9|11))';
  const mod = `(?:\\(${_mod}\\)|${_mod})`
  const sus = '(?:sus(2|4|24|2sus4)?)';
  const add = '(?:add[b#]?(?:2|4|6|7|9|11|13))';
  const bass = `(?:\\/${note})`;

  const lookahead = '(?=$| )';
  const source = `${note}${
    `(?:${altered}|${
      `(?:${minor}?(?:${ext}|${major}?${majorableExt})?)`
      + `${mod}*${sus}?${mod}*${add}?`
    })`
    }${bass}?${lookahead}`;

  return source;
}

function chordLineRegex() {
  return `^ *((${chordRegex()}|N.C.) *)+$`
}

export default {
  chord: new RegExp(chordRegex()),
  chord_src: chordRegex(),
  isChord: (str, caseSensitive = true) => new RegExp(`^${chordRegex()}$`, caseSensitive ? "" : "i").test(str),
  chordLine: new RegExp(chordLineRegex()),
  chordLine_g: new RegExp(chordLineRegex(), "g"),
  chordDefinition: /[x\d]{6}/,
  songPart: /\[([^\]]*)\]/,
  songPartNumbered: /\[([^\]]*) (\d+)\]/,
  annotation: /\(([^)]*)\)/,
}