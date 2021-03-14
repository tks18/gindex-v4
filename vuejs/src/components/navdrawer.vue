<template>
  <v-navigation-drawer v-model="$state.navdraw.active" app temporary>
    <v-container>
      <v-row>
        <v-col cols="12" align="center">
          <v-avatar size="60" color="primary">
            {{ currgd.name.slice(0, 1) }}
          </v-avatar>
          <v-toolbar-title
            @click="homeroute"
            class="text-center point-cursor font-weight-bold"
          >
            {{ currgd.name }}
          </v-toolbar-title>
        </v-col>
        <v-col cols="12" v-show="logged" class="my-0">
          <v-text-field
            label="Search"
            color="primary"
            v-model="param"
            @keypress.enter="query"
            prepend-inner-icon="mdi-cloud-search"
            hint="Be Particular !"
            dense
            outlined
            rounded
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Settings</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item-group>
                  <v-tooltip bottom transition="slide-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-icon>
                          <v-icon> mdi-cog-outline </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            Change Accent Color
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span>Change Accent Color</span>
                  </v-tooltip>
                </v-list-item-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Spaces</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item-group>
                  <v-tooltip
                    bottom
                    transition="slide-y-transition"
                    v-for="(folder, index) in gds"
                    v-bind:key="index"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item
                        @click="changeItem(folder)"
                        v-on="on"
                        v-bind="attrs"
                      >
                        <v-list-item-icon small>
                          <v-icon small>mdi-folder</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="text-subtitle-1">
                            {{ folder.name }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span>{{ folder.name }}</span>
                  </v-tooltip>
                </v-list-item-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" class="my-0">
          <v-divider class="my-0"></v-divider>
        </v-col>
        <v-col cols="12" v-show="!logged">
          <div class="navigation">
            <div class="text-caption text-center">Navigate Now</div>
            <v-list-item-group class="my-1">
              <v-list-item
                v-for="(link, index) in not_logged_links"
                @click="gotoPage(link.url.link, link.url.cmd)"
                v-bind:key="index"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ link.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ link.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </div>
        </v-col>
        <v-col cols="12" v-show="logged">
          <div class="navigation">
            <div class="text-caption text-center">Navigate Now</div>
            <v-list-item-group class="my-1">
              <v-list-item @click="gotoPage('/')">
                <v-list-item-icon>
                  <v-icon> mdi-home </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> View All (Root) </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="(link, index) in quicklinks"
                @click="gotoPage('/' + link.link + '/')"
                v-bind:key="index"
              >
                <v-list-item-icon>
                  <v-icon> mdi-folder-text </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ link.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </div>
        </v-col>
        <v-col cols="12" class="my-0">
          <v-divider class="my-0"></v-divider>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" v-show="logged">
          <v-list-item-group>
            <v-tooltip top transition="slide-y-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="gotoPage('/', 'settings')"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-list-item-icon>
                    <v-icon> mdi-account-circle </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ user.name }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <span>{{ user.name }}</span>
            </v-tooltip>
            <v-list-item v-show="admin" @click="gotoPage('/', 'admin')">
              <v-list-item-icon>
                <v-icon> mdi-shield-account </v-icon>
              </v-list-item-icon>
              <v-list-item-title> Admin Panel </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon> mdi-logout-variant </v-icon>
              </v-list-item-icon>
              <v-list-item-title> Logout </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import { getItem, removeItem } from '@utils/encryptUtils';
import { initializeUser } from '@utils/localUtils';
export default {
  data: () => {
    return {
      user: {},
      token: {},
      currgd: {},
      gdindex: 0,
      gds: [],
      param: '',
      logged: false,
      admin: false,
      quicklinks: [],
      superadmin: false,
      not_logged_links: [
        {
          title: 'Register',
          icon: 'mdi-account-plus',
          url: {
            link: '/otp/',
            cmd: 'register',
          },
        },
        {
          title: 'Request Access',
          icon: 'mdi-account-plus-outline',
          url: {
            link: '/request/user/',
            cmd: 'register',
          },
        },
        {
          title: 'Login',
          icon: 'mdi-login-variant',
          url: {
            link: '/',
            cmd: 'login',
          },
        },
      ],
    };
  },
  methods: {
    chooseGD() {
      let index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
        this.gdindex = this.gds[index].index;
      }
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
            let resp = response.data;
            this.quicklinks = resp.quicklink;
          } else {
            this.quicklinks = [];
          }
        });
    },
    homeroute() {
      this.$router.push({ path: '/' + this.gdindex + ':' + 'home/' });
    },
    query() {
      if (this.param) {
        this.$state.navdraw.active = !this.$state.navdraw.active;
        this.$router.push({
          path: this.currgd.id.match('/[0-9]+:') + 'search?q=' + this.param,
        });
      }
    },
    changeItem(item) {
      this.currgd = item;
      this.$router.push({
        path: '/' + item.index + ':home/',
      });
      this.getallPosts(item.index);
      this.$bus.$emit('td', 'TD Changed');
    },
    gotoPage(url, cmd) {
      this.isActive = !this.isActive;
      if (cmd) {
        this.$router.push({ path: '/' + this.gdindex + ':' + cmd + url });
      } else {
        this.$router.push({ path: '/' + this.gdindex + ':' + url });
      }
    },
    loginorout() {
      var userData = initializeUser();
      if (userData.isThere) {
        if (userData.type == 'hybrid') {
          this.user = userData.data.user;
          this.logged = userData.data.logged;
        } else if (userData.type == 'normal') {
          this.user = userData.data.user;
          this.token = userData.data.token;
          this.logged = userData.data.logged;
          this.admin = userData.data.admin;
          this.superadmin = userData.data.superadmin;
        }
      } else {
        this.logged = userData.data.logged;
      }
      this.getallPosts(this.$route.params.id);
    },
    logout() {
      this.isActive = !this.isActive;
      var token = getItem('tokendata');
      var user = getItem('userdata');
      var session = getItem('sessiondata');
      var hyBridToken = getItem('hybridToken');
      if ((hyBridToken && hyBridToken != null) || hyBridToken != undefined) {
        removeItem('hybridToken');
        this.$bus.$emit('logout', 'User Logged Out');
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
      } else if (user != null && token != null && session != null) {
        removeItem('tokendata');
        removeItem('userdata');
        removeItem('sessiondata');
        this.$bus.$emit('logout', 'User Logged Out');
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
  },
  created() {
    this.$bus.$on('logged', () => {
      this.loginorout();
      this.changeNavbarStyle();
    });
    this.$bus.$on('logout', () => {
      this.loginorout();
      this.changeNavbarStyle();
    });
    this.loginorout();
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: '/' + index + ':',
          index: index,
        };
      });
      this.chooseGD();
    }
    if (window.MODEL) {
      this.param = window.MODEL.q ? window.MODEL.q : '';
    }
  },
  watch: {
    '$route.params.id': 'chooseGD',
  },
};
</script>

<style></style>
