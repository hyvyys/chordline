import Vue from 'vue';
import VueYoutube from 'vue-youtube';
Vue.use(VueYoutube);

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

import KeenUI from 'keen-ui';
Vue.use(KeenUI);

import App from './App.vue';
import router from './router';
import store from './store';

import 'keen-ui/dist/keen-ui.css';
import "@/scss/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount('#app');
