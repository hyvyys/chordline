
function syllableRegex() {
  const consonants = "[bcdfghjklmnpqrstvwxyz'-]";
  const vowels = "[aeiouy]";
  const separators = "[ \\.,:;!?]|$";
  const wordSep = `(?=${separators})`;
  const wordSepOrConsonant = `(?=${separators}|${consonants})`;

  return new RegExp(
    `${consonants}*${vowels}{1,3}` +
    `(${consonants}*e${wordSep}|${consonants}*${wordSepOrConsonant})`,
    "ig"
  );
}

/* should give something like (unescaped): 
/[bcdfghjklmnpqrstvwxyz']*[aeiouy]{1,3}([bcdfghjklmnpqrstvwxyz']*e(?=[ ,.:'!?]|$)|[bcdfghjklmnpqrstvwxyz']*(?=[ ,.:'!?]|[bcdfghjklmnpqrstvwxyz']|$))/gi;
*/

export default syllableRegex();