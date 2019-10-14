export default {
  methods: {
    formatNote(n) {
      return n
        .replace(/bb/, '𝄫')
        .replace(/b/, '♭')
        .replace(/##/, '𝄪')
        .replace(/#/, '♯');
    },
  }
}