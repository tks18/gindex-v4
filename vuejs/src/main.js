/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/loading.css';
import notification from '@/components/notification';
import axios from '@/plugin/axios';
import rawAxios from 'axios';
import VueAxios from 'vue-axios';
import vSelect from 'vue-select';
import Vclipboard2 from 'vue-clipboard2';
import VueLazyload from 'vue-lazyload';
import VTooltip from 'v-tooltip';
import Viewer from 'v-viewer';
import Meta from 'vue-meta';
import VuePlyr from 'vue-plyr';
import App from './App.vue';
import cdnpath from './libs/util.cdn';
import { createPlayer, globalPlayer, destroyPlayer } from './plugin/aplayer';
import router from './router';
import loadTheme from './themeManager';
import 'viewerjs/dist/viewer.css';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.config.productionTip = false;
Vue.prototype.$currentTheme = loadTheme();
Vue.prototype.$cdnpath = cdnpath;
Vue.prototype.$backend = rawAxios;
Vue.prototype.$notify = notification;
Vue.prototype.$bus = new Vue({});
Vue.prototype.$audio = {
  createPlayer,
  player: globalPlayer,
  destroy: destroyPlayer,
};
Vue.use(VuePlyr, {
  invertTime: false,
  settings: ['quality', 'speed', 'loop', 'captions'],
  controls: [
    'play-large',
    'restart',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
});
Vue.use(Loading);
Vue.use(VTooltip);
Vue.use(VueAxios, axios);
Vue.use(Meta);
Vclipboard2.config.autoSetContainer = true;
Vue.use(Vclipboard2);
Vue.component('VSelect', vSelect);
Vue.use(require('vue-moment'));

Vue.use(VueLazyload, {
  loading:
    'https://i.pinimg.com/originals/4d/a1/a6/4da1a6911fdbc6f21fdd14d2140b2d61.gif',
  lazyComponent: true,
});
Vue.use(Viewer);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
