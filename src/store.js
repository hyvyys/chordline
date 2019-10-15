/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    disposable: null,
  },
  mutations: {
    storeDisposableCompletionItemProvider(state, { disposableCompletionItemProvider }) {
      state.disposableCompletionItemProvider = disposableCompletionItemProvider;
    }
  },
  actions: {

  }
})
