import Vue from "vue";
import App from "./App.vue";
import { Loading } from "element-ui";
import "element-ui/lib/theme-chalk/icon.css";
import "element-ui/lib/theme-chalk/notification.css";
import "element-ui/lib/theme-chalk/loading.css";
import axios from "@/plugin/axios";
import rawAxios from "axios";
import VueAxios from "vue-axios";
import router from "./router";
import vSelect from 'vue-select';
import EventBus from "./EventBus";
import i18n from "./i18n";
import Vclipboard2 from "vue-clipboard2";
import store from "@/store/index";
import VueLazyload from "vue-lazyload";
import VTooltip from 'v-tooltip'
import Viewer from "v-viewer";
import { createPlayer, globalPlayer, destroyPlayer } from "./plugin/aplayer";
import cdnpath from "./libs/util.cdn";
import '@/components'
import Meta from 'vue-meta';
import themeManager from './themeManager';
import "viewerjs/dist/viewer.css";
import VuePlyr from "vue-plyr";
themeManager();
Vue.config.productionTip = false;
Vue.prototype.$cdnpath = cdnpath;
Vue.prototype.$backend = rawAxios;
Vue.prototype.$bus = EventBus;
Vue.prototype.$audio = {
  createPlayer: createPlayer,
  player: globalPlayer,
  destroy: destroyPlayer,
}
Vue.use(VuePlyr, {
  invertTime: false,
  settings: ["quality", "speed", "loop", "captions"],
  controls: [
    "play-large",
    "restart",
    "play",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "captions",
    "settings",
    "pip",
    "airplay",
    "fullscreen",
  ],
})
Vue.use(Loading);
Vue.use(VTooltip);
Vue.use(VueAxios, axios);
Vue.use(Meta);
Vclipboard2.config.autoSetContainer = true
Vue.use(Vclipboard2);
Vue.component('v-select', vSelect)
Vue.use(require('vue-moment'));
Vue.use(VueLazyload, {
  loading: "https://i.pinimg.com/originals/4d/a1/a6/4da1a6911fdbc6f21fdd14d2140b2d61.gif",
  lazyComponent: true
});
Vue.use(Viewer);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  mounted() {
    this.$store.dispatch("acrou/view/load");
  },
}).$mount("#app");
