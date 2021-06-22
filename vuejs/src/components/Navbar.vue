<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item nav-link">
          <h3
            v-tooltip.bottom-start="'Home'"
            class="title has-text-netflix-only is-3"
            @click="homeroute"
          >
            {{ currgd.name }}
          </h3>
        </div>
        <a
          role="button"
          :class="
            'navbar-burger burger accent' + (isActive ? 'navbar-active' : '')
          "
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="burgerClick"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="navbarBasicExample"
        :class="'navbar-menu ' + (isActive ? 'is-active' : '')"
        style="background-color: inherit"
      >
        <div class="navbar-start">
          <a
            v-if="!logged"
            v-tooltip.bottom-start="'OTP Registration'"
            class="navbar-item"
            @click="gotoPage('/otp/', 'register')"
          >
            <span>Register</span>
          </a>
          <a
            v-if="!logged"
            v-tooltip.bottom-start="'Request Access'"
            class="navbar-item"
            @click="gotoPage('/request/user/', 'register')"
          >
            <span>Request Access</span>
          </a>
          <a
            v-if="!logged"
            v-tooltip.bottom-start="'Login'"
            class="navbar-item"
            @click="gotoPage('/', 'login')"
          >
            <span>Login</span>
          </a>
          <a
            v-for="(link, index) in quicklinks.slice(0, 3)"
            v-show="logged"
            :key="index"
            v-tooltip.bottom-start="link.title"
            class="navbar-item"
            @click="gotoPage('/' + link.link + '/')"
          >
            <span>{{ link.title }}</span>
          </a>
          <a
            v-show="logged"
            v-tooltip.bottom-start="'Go to Root'"
            class="navbar-item"
            title="All"
            @click="gotoPage('/')"
          >
            <span>View All</span>
          </a>
          <div
            v-if="!logged"
            :class="
              ismobile
                ? gddropdown
                  ? 'navbar-item has-dropdown is-active'
                  : 'navbar-item has-dropdown'
                : 'navbar-item has-dropdown is-hoverable'
            "
            @click="ismobile ? (gddropdown = !gddropdown) : ''"
          >
            <a class="navbar-link" style="background-color: inherit">Spaces</a>
            <div class="navbar-dropdown is-boxed">
              <a
                v-for="(item, index) in gds"
                :key="index"
                class="navbar-item"
                @click="changeItem(item)"
                >{{ item.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <!-- is-hidden-desktop -->
          <div
            v-if="logged"
            :class="
              ismobile
                ? gddropdown
                  ? 'navbar-item has-dropdown is-active'
                  : 'navbar-item has-dropdown'
                : 'navbar-item has-dropdown is-hoverable'
            "
            @click="ismobile ? (gddropdown = !gddropdown) : ''"
          >
            <a class="navbar-link" style="background-color: inherit">Spaces</a>
            <div class="navbar-dropdown is-boxed">
              <a
                v-for="(item, index) in gds"
                :key="index"
                class="navbar-item"
                @click="changeItem(item)"
                >{{ item.name }}
              </a>
            </div>
          </div>
          <a
            v-if="logged && !searchBar"
            v-tooltip.bottom-start="'Search'"
            class="navbar-item"
            @click="searchBar = true"
          >
            <span class="icon">
              <i class="fas fa-search"></i>
            </span>
            <span class="is-hidden-desktop">Search</span>
          </a>
          <div
            v-if="logged"
            v-show="showSearch && searchBar"
            class="navbar-item"
          >
            <div class="field is-grouped">
              <p class="control has-icons-right is-dark" style="width: 100%">
                <input
                  v-model="param"
                  v-tooltip.bottom-start="'Search the Drive'"
                  class="input is-rounded search-input"
                  type="search"
                  autofocus
                  placeholder="Search Files"
                  @keyup.enter="query"
                  @keyup.esc="searchBar = !searchBar"
                />
                <span class="icon is-small is-right">
                  <i class="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
          <a
            v-if="logged && miniplayer"
            v-tooltip.bottom-start="'Stop Music Player'"
            class="navbar-item"
            title="Stop Music Player"
            @click="closeMusicPlayer()"
          >
            <span class="icon">
              <i class="fas fa-volume-mute"></i>
            </span>
            <span class="is-hidden-desktop">Stop Player</span>
          </a>
          <a
            v-if="logged"
            v-tooltip.bottom-start="'Go to Settings'"
            class="navbar-item"
            title="Profile"
            @click="gotoPage('/', 'settings')"
          >
            <span class="icon">
              <i class="far fa-user"></i>
            </span>
            <span class="">{{ user.name.slice(0, 10) }}</span>
          </a>
          <a
            v-if="logged && admin"
            v-tooltip.bottom-start="'Admin Panel'"
            class="navbar-item"
            title="Admin Panel"
            @click="gotoPage('/', 'admin')"
          >
            <span class="icon">
              <i class="fas fa-user-shield"></i>
            </span>
            <span class="is-hidden-desktop">Admin Zone</span>
          </a>
          <a
            v-if="logged"
            v-tooltip.bottom-start="'Logout'"
            class="navbar-item"
            title="Logout"
            @click="logout"
          >
            <span class="icon">
              <i class="fas fa-sign-out-alt"></i>
            </span>
            <span class="is-hidden-desktop">Logout</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import { getItem, removeItem } from '@utils/encryptUtils';
import { initializeUser } from '@utils/localUtils';

export default {
  data() {
    return {
      user: {},
      token: {},
      siteName: '',
      active: false,
      param: '',
      currgd: {},
      loading: false,
      navbarStyle: '',
      netflix_black: false,
      mouseover: false,
      miniplayer: false,
      backgroundClass: '',
      searchBar: false,
      fullpage: true,
      logged: false,
      admin: false,
      quicklinks: [],
      superadmin: false,
      gds: [],
      gdindex: '',
      gddropdown: false,
      isActive: false,
      eyes:
        'data:image/png;base64,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',
    };
  },
  computed: {
    showSearch() {
      return window.MODEL ? window.MODEL.root_type < 2 : true;
    },
    siteTitle() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
    ismobile() {
      const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width > 966) {
        return false;
      }
      return true;
    },
  },
  watch: {
    '$route.params.id': 'chooseGD',
    $route() {
      if (this.$route.name === 'home' && !this.logged) {
        this.navbarStyle = 'transparent';
        this.backgroundClass = 'home-back';
      } else {
        this.navbarStyle = 'black';
        this.backgroundClass = 'none';
      }
    },
  },
  created() {
    this.loginorout();
    this.active = false;
    this.siteName = document.getElementsByTagName('title')[0].innerText;
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => ({
        name: item,
        id: `/${index}:`,
        index,
      }));
      this.chooseGD();
    }
    if (window.MODEL) {
      this.param = window.MODEL.q ? window.MODEL.q : '';
    }
  },
  mounted() {
    this.netflix_black = window.themeOptions.prefer_netflix_black;
    this.$bus.$on('logged', () => {
      this.loginorout();
      this.changeNavbarStyle();
    });
    this.$bus.$on('music-toggled', () => {
      if (this.$audio.player() === undefined) {
        this.miniplayer = false;
      } else if (this.$audio.player() !== undefined) {
        this.miniplayer = true;
      }
    });
    this.changeNavbarStyle();
  },
  methods: {
    chooseGD() {
      const index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
        this.gdindex = this.gds[index].index;
        this.getallPosts(this.$route.params.id);
      }
    },
    changeItem(item) {
      this.currgd = item;
      this.$router.push({
        path: `/${item.index}:home/`,
      });
      this.getallPosts(item.index);
      this.$bus.$emit('td', 'TD Changed');
    },
    query() {
      if (this.param) {
        this.isActive = !this.isActive;
        this.$router.push({
          path: `${this.currgd.id.match('/[0-9]+:')}search?q=${this.param}`,
        });
      }
    },
    burgerClick() {
      this.isActive = !this.isActive;
    },
    hoverclick() {
      this.active = !this.active;
    },
    getallPosts(id) {
      this.$backend
        .post(
          apiRoutes.getallPosters,
          {
            email: this.user.email,
            root: id,
          },
          backendHeaders(this.token.token),
        )
        .then((response) => {
          if (response.data.auth && response.data.registered) {
            const resp = response.data;
            this.quicklinks = resp.quicklink;
          } else {
            this.quicklinks = [];
          }
        });
    },
    loginorout() {
      const userData = initializeUser();
      if (userData.isThere) {
        this.user = userData.data.user;
        this.token = userData.data.token;
        this.logged = userData.data.logged;
        this.admin = userData.data.admin;
        this.superadmin = userData.data.superadmin;
      } else {
        this.logged = false;
      }
      this.getallPosts(this.$route.params.id);
    },
    homeroute() {
      this.$router.push({ path: `/${this.gdindex}:home/` });
    },
    gotoPage(url, cmd) {
      this.isActive = !this.isActive;
      if (cmd) {
        this.$router.push({ path: `/${this.gdindex}:${cmd}${url}` });
      } else {
        this.$router.push({ path: `/${this.gdindex}:${url}` });
      }
    },
    logout() {
      this.isActive = !this.isActive;
      const token = getItem('tokendata');
      const user = getItem('userdata');
      const session = getItem('sessiondata');
      if (user != null && token != null && session != null) {
        removeItem('tokendata');
        removeItem('userdata');
        removeItem('sessiondata');
        this.loginorout();
        this.changeNavbarStyle();
        this.$bus.$emit('logout', 'Log Out Success');
        this.$router.push({
          name: 'results',
          params: {
            id: this.gdindex,
            cmd: 'result',
            success: true,
            data: 'You are Being Logged Out. Please Wait',
            redirectUrl: '/',
            tocmd: 'home',
          },
        });
      } else {
        this.loading = false;
      }
    },
    changeNavbarStyle() {
      if (this.$route.name === 'home' && !this.logged) {
        this.navbarStyle = 'transparent';
        this.backgroundClass = 'home-back';
      } else {
        this.navbarStyle = 'black';
        this.backgroundClass = 'none';
      }
    },
    closeMusicPlayer() {
      if (this.$audio.player() === undefined) return;
      this.$audio.destroy();
      this.$bus.$emit('music-toggled', 'Music Toggled');
    },
  },
};
</script>
