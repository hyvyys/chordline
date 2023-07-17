/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

<template>
  <div class="home">
    <SiteHeader>
      <div class="home-link">♪ chordline</div>
      <router-link class='link-padded' to="/editor">Editor</router-link>
      <router-link class='link-padded' to="/lookup">Chord Lookup</router-link>
    </SiteHeader>
    
    <div class="lead u-dark">
      <div class="reading">
        <p class='headline'>
          Write down your guitar tabs faster with a keyboard-controlled YouTube player
          right next to a feature-rich text editor and a MIDI chord player.
        </p>
        <p>
          <router-link class="link-padded" to="/editor">
            Create a new chord sheet
          </router-link>
        </p>
      </div>
    </div>

    <div class="reading">
      <router-link to="/editor" class="img-blurb">
        <div class="container">
          <img src="../assets/img/chordline-screenshot.png" />
        </div>
      </router-link>
    </div>

    <div class="main-text u-content">
      <div class="reading">
        <p>
          Start by pasting a YouTube url to load the song, and paste your lyrics in the editor
          (<a href="https://genius.com/">Genius</a> is a great source as it often includes the song part names).
        </p>
        <p>
          Listen to the song and write down the chords. Press <KeyCombo keys="Ctrl+Space" /> to play or pause the video,
          and use <KeyCombo keys="Ctrl+<" /> and <KeyCombo keys="Ctrl+>" /> to rewind it. Not having to switch windows all the time
          should give you a speed boost!
        </p>
        <p>As a common convention, chord sheets are divided into song parts, each written within brackets.
          When you type as little as an opening bracket, you'll get song part suggestions.
        </p>
        <p>
          As you type, placing the caret on a chord will display chord diagrams of its fingerings in the panel on the right side.
          You can then click on each one to listen to it or copy its textual equivalent, e.g. <code class="snippet">Asus2&nbsp;&nbsp;&nbsp;x02200</code>, to the clipboard.
          Sometimes you might find it helpful to copy these snippets for the more exotic chords you decide to write down, and paste them
          in the beginning of your tab. 
        </p>
        <p>
          You can check the Autoplay option to play each chord under caret whenever it changes while the video is paused.
        </p>
        <p>
          If you need to take a break, don't fret — your work is saved locally in your browser, and will be restored the next time you visit the site.
        </p>
        <p>
          Once you're done, upload your tab to your favorite guitar tab site and enjoy eternal glory!
          <a href="https://ultimate-guitar.com">UltimateGuitar</a> is home to a whole lot of good guitar tabs and chord sheets, but it's
          always growing.
        </p>
      </div>
    </div>
    
    <div class="final reading">
      <div class="logotype u-flex">
        <img alt="Chordline logo" src="../assets/logo/chordline-64px.png">
        <span>chordline</span>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<script>
const version = require('@/../package.json').version;
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import KeyCombo from "@/components/KeyCombo.vue";

export default {
  name: 'home',
  components: {
    SiteHeader,
    SiteFooter,
    KeyCombo,
  },
  data() {
    return {
      version,
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  background: $home-background;
}

$lead-slope-height: 150px;

.lead {
  color: $dark-text;
  color: $dark-text-subtle;
  position: relative;
  padding-top: 2rem;
  padding-bottom: $lead-slope-height;
  margin-bottom: -$lead-slope-height;
  background: $dark-background;
  background: linear-gradient($dark-background, $dark-medium);


  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: $lead-slope-height;
    background: linear-gradient(to top left, $home-background 49.75%, transparent 50.25%);
  }

  .reading {
    padding: 40px 0;
  }

  font-size: 22px;
  a {
    font-weight: 600;
    font-size: 20px;
  }
}

.main-text {
  margin: 70px 0 70px;
}

.final {
  margin-bottom: 100px;
}

$img-width: Min(80vw, 1000px);
$img-height: calc(492/1000*Min(80vw, 1000px));

.img-blurb {
  box-sizing: content-box;
  width: $img-width;
  height: $img-height;
  padding: 15px;
  align-self: center;
  display: block;

  z-index: 1;
  border-radius: 10px;
  box-shadow:
    -1px -5px 10px -1px rgba($dark-background, 0.5),
    0 5px 8px 1px rgba($dark-background, 0.2);
  box-shadow: 2px 4px 8px rgba($dark-background, 0.2);

  $duration: 0.6s;
  transition: transform $duration;
  transform: perspective(1000px) rotateX(5deg) scale(0.99);
  @include shiny-glass;
  overflow: hidden;
  background: rgba($dark-medium, 0.3);
  background: rgba($accent, 0.4);
  background: rgba($dark-medium, 0.6);
  background: rgba(#d6d6d6, 0.1);
  // border: 1px solid #fff;

  &::after {
    opacity: 0.6;
    z-index: 1;
    transition: transform $duration, opacity $duration;
    transform: scale(1.2) translateX(-20px);
  }

  .container {
    z-index: 1;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
    width: $img-width;
    height: $img-height;

    img {
      width: $img-width;
      height: $img-height;
      max-width: 90vw;
      display: block;
    }

    &::before,
    &::after {
    content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;
      transition: transform $duration, opacity $duration;
    }
    &::before {
      $t: rgba(#271d3b, 1);
      $w: rgba(#2f3b52, 1);
      background: linear-gradient(178deg, $t, $w 70%);
      z-index: -1;
    }
    &::after {
      $t: rgba(#271d3b, 0.6);
      $w: rgba(#2f3b52, 0.6);
      background: linear-gradient(178deg, $t, $w 70%);
    }
  }

  &:hover {
    transform: perspective(1000px) rotateX(2deg) scale(1);
    &::after {
      opacity: 0.5;
      transform: translateY(-30px) scale(1.2) translateX(-30px);
    }
    .container {
      &::after {
        transform: scaleY(1.25);
        opacity: 0.1;
      }
    }
  }
}

.logotype {
  font-family: Aromatron;
  font-size: 3rem;
  color: $accent;
  span {
    margin-right: 1rem;
  }
}
</style>
