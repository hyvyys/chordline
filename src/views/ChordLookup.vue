<template>
  <div class="app-content chord-lookup">
    <SiteHeader>
      <router-link to="/" class="home-link">♪ chordline</router-link>
      <router-link class='link-padded' to="/editor">Editor</router-link>
      <router-link class='link-padded' to="/lookup">Chord Lookup</router-link>
      <UiTextbox v-model="chordSearch"
        autofocus
        placeholder="Chord symbol"
        spellcheck="false"
      />
      <UiSelect class="instrument-select" :options="instruments" v-model="instrument" />
      <UiSelect class="capo-select" :options="capoOptions"  v-model="capo" />
      <UiSelect class="tuning-select" :options="tunings" v-model="tuning" />
      <UiCheckbox v-model="autoPlay" class="autoplay-checkbox">
        Autoplay
      </UiCheckbox>
    </SiteHeader>

    <div class="u-scroll">
      <div class="info" v-if="chord" >
        <UiButton class="permalink" color="secondary" v-clipboard:copy="permalink">
          Copy Permalink {{ permalink }}
        </UiButton>
        <span>
          Click fingerings for playback
        </span>
      </div>

      <div class="u-content u-fill-page">

        <div class="reading" v-if="!chord">
          <p>Type in a chord symbol to see its fingerings.</p>
          <div class="examples">
            <p>Examples</p>
            <ul>
              <li>
                <router-link :to="getRouterLink('C')">C</router-link>
              </li>
              <li>
                <router-link :to="getRouterLink('Em')">Em</router-link>
              </li>
              <li>
                <router-link :to="getRouterLink('D7')">D7</router-link>
              </li>
              <li>
                <router-link :to="getRouterLink('Amaj7sus2')">Amaj7sus2</router-link>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="chord-info">
          <div class="chord-name">
            <h2>
              {{ formatNote(chord.symbol) }}
            </h2>
            {{ chord.description }}
          </div>

          <div class="chord-aliases">
            <table>
              <tr>
                <td>Aliases</td>
                <td>{{ chord.symbols.join(', ') }}</td>
              </tr>
              <tr>
                <td></td>
                <td class="other">{{ chord.altSymbols.join(', ') }}</td>
              </tr>
            </table>
          </div>

          <div class="chord-composition">
            <table>
              <tr>
                <td>Notes</td>
                <td v-for="n in chord.notes" :key="n">{{ formatNote(n) }}</td>
              </tr>
              <tr>
                <td>Intervals</td>
                <td v-for="i in intervals" :key="i.interval" :class="{'optional': i.optional}">
                  {{ i.interval }}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <p class="chord-fingerings">
          <ChordFingeringFull v-for="(chordFingering, i) in chordFingerings" :key="i"
            :chordSymbol="chord.symbol"
            :chordFingering="chordFingering" 
            :tuning="tuning"
            @play="onFingeringClicked(i)"
          />
        </p>
      </div>

      <SiteFooter />
    </div>
  </div>
</template>

<script>
const version = require('@/../package.json').version;
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import UiTextbox from "keen-ui/src/UiTextbox.vue";
import UiSelect from "keen-ui/src/UiSelect.vue";
import UiButton from "keen-ui/src/UiButton.vue";
import ChordFingeringFull from "@/components/ChordFingeringFull.vue";
import ChordPlayer from "@/mixins/ChordPlayer.js";
import MusicText from "@/mixins/MusicText";
import UiCheckbox from "keen-ui/src/UiCheckbox.vue";

export default {
  name: 'home',
  mixins: [
    ChordPlayer,
    MusicText,
  ],
  components: {
    SiteHeader,
    SiteFooter,
    UiTextbox,
    UiSelect,
    UiButton,
    UiCheckbox,
    ChordFingeringFull,
  },
  data() {
    return {
      version,
      chordSearchCaseSensitive: false,
    }
  },
  computed: {
    intervals() {
      const optInt = this.chord.optionalIntervals;
      return this.chord.intervals.map(interval => ({
        interval,
        optional: optInt.includes(interval) 
      }));
    },
    permalink() {
      return this.chord 
        ? this.getLink(this.chord.symbol)
        : '';
    },
  },
  created() {
    this.navigate();
  },
  watch: {
    $route() {
      this.navigate();
    },
  },
  methods: {
    navigate() {
      const search = this.$route.params.chordSearch;
      if (search) {
        this.chordSearch = decodeURI(search);
      }
      else {
        this.chordSearch = '';
        this.chordEntry = null;
      }
    },
    getLink(symbol) {
      return window.location.host + this.getRouterLink(symbol);
    },
    getRouterLink(symbol) {
      const url = '/lookup/';
      return url + encodeURIComponent(symbol);
    },
  },
}
</script>

<style lang="scss" scoped>
.examples {
  em {
    color: $text-subtle;
    font-size: 0.95em;
  }
}

.content {
  margin: 0 auto;
  padding: 2rem;
  width: 90vw;
  overflow: hidden auto;
}
.chord-fingerings {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .chord-fingering {
    margin: 0.6rem;
  }
}

.chord-info {
  display: flex;
  align-items: flex-start;
  margin: 0 2rem;
  > * {
    margin: 0 1.5rem;
  }
}

td {
  padding-right: 0.5em;
  line-height: 1.2;
  vertical-align: top;
}
td:first-child {
  font-weight: bold;
  text-align: right;
}

.chord-name {
  flex: 2;
  h2 {
    min-width: 6em;
    line-height: 0.95;
    margin: 0;
  }
}

.chord-aliases {
  flex: 3;
  .other {
    color: $text-subtle;
  }
}

.chord-composition {  
  flex: 4;

  td {
    text-align: right;
  }
  .optional {
    &::before {
      content: '(';
    }
    &::after {
      content: ')';
    }
  }
}

.info {
  display: flex;
  justify-content: space-between;
  color: $text-subtle;
  align-items: baseline;

  span {
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 200;
  }
}

.ui-button.permalink {
  text-transform: none;
  font-weight: normal;
  color: $text-subtle;
  &:hover {
    color: $light-link-hover;
  }
}

.examples {
  color: $text-subtle;
  p {
    margin: 0.4rem 0;
  }
  ul {
    margin: 0;
  }
}
</style>
