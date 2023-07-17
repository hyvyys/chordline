/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

<template>
  <footer class="site-footer u-dark">
    <div class="subtle">
      Copyright 2019–2023 Adam Jagosz.
    </div>

    <a class="github-link" href="https://github.com/hyvyys/chordline" target="_blank">
      <div>
        Feedback?
        <br />
        <span>
        Visit Chordline
        </span>
        <br />
        on Github
      </div>
      <img
        svg-inline
        height="32"
        width="32"
        alt="Github"
        src="@/assets/icons/github.svg"
      />
    </a>
    
    <div class="subtle">
      Chordline version {{ version }}
    </div>
  </footer>
</template>

<script>
const version = require('@/../package.json').version;

export default {
  name: 'site-footer',
  data() {
    return {
      version,
    }
  },
}
</script>

<style lang="scss" scoped>
.site-footer {
  background: $dark-background;
  background: linear-gradient(-2deg, $dark-background 10%, $dark-medium);
  line-height: 1.1;


  display: grid;
  grid-template-columns: 1fr auto 1fr;
  
  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
  }
  justify-content: center;
  align-items: center;
  padding: 30px;

  > * {
    margin: 10px 30px;
  }
  > :first-child {
    text-align: right;
  }
  > :last-child {
    text-align: left;
  }

  .subtle {
    color: $dark-text-subtle;
  }

  .github-link {
    text-decoration: none;
    padding: 0.5em;
    overflow: visible;
    display: flex;
    align-items: center;
    div {
      margin: 0.2em;
      text-align: right;
    }
    span {
      margin-right: 6px;
    }
  }
}
</style>