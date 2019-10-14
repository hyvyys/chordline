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
