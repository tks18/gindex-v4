<template>
  <nav class="navbar has-background-black" role="navigation" aria-label="main navigation" :style="{background: navbarStyle}">
    <div class="container">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div v-if="logo" class="navbar-brand">
        <img class="is-rounded nav-link px-2 py-2" width="60" @click="homeroute" :src="logoLink">
        <a
          role="button"
          style="color: #e50914;"
          :class="'navbar-burger burger ' + (isActive ? 'navbar-active' : '')"
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
      <div v-if="!ismobile" class="navbar-brand">
        <div class="navbar-item nav-link">
          <h3 class="title is-3 has-text-white" @click="homeroute">
            {{ siteName }}
          </h3>
        </div>
        <a
          role="button"
          style="color: #e50914;"
          :class="'navbar-burger burger ' + (isActive ? 'navbar-active' : '')"
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
        <div class="navbar-end">
          <!-- is-hidden-desktop -->
          <div
            :class="ismobile ? gddropdown ? 'navbar-item has-dropdown is-active' : 'navbar-item has-dropdown' : 'navbar-item has-dropdown is-hoverable' "
           @click="ismobile ? gddropdown = !gddropdown : '' ">
            <a class="navbar-link" style="background-color: inherit;">{{ this.currgd.name }}</a>
            <div class="navbar-dropdown is-boxed">
              <a
                class="navbar-item"
                @click="changeItem(item)"
                v-for="(item, index) in getCurrGD"
                v-bind:key="index"
                >{{ item.name }}</a
              >
            </div>
          </div>
          <div v-if="logged" class="navbar-item" v-show="showSearch">
            <div class="field is-grouped">
              <p class="control has-icons-left is-dark" style="width:100%;">
                <input
                  class="input is-rounded search-input"
                  @keyup.enter="query"
                  v-model="param"
                  type="search"
                  :placeholder="$t('search.placeholder')"
                />
                <span class="icon is-small is-left" style="padding:0 5px;">
                  <!-- <i class="fas fa-search"></i> -->
                  <img :src="eyes" />
                </span>
              </p>
            </div>
          </div>
          <a
            class="navbar-item"
            title="OTP Registration"
            v-if="!logged"
            @click="gotoPage('/otp/', 'register')"
           >
           <span class="icon">
            <i class="fas fa-user-check"></i>
          </span>
          <span>Register</span>
          </a>
          <a
            class="navbar-item"
            title="Request Access"
            v-if="!logged"
            @click="gotoPage('/request/user/', 'register')"
           >
           <span class="icon">
            <i class="fas fa-user-plus"></i>
          </span>
          <span>Request Access</span>
          </a>
          <a
            class="navbar-item"
            title="Login"
            v-if="!logged"
            @click="gotoPage('/', 'login')"
           >
           <span class="icon">
            <i class="fas fa-power-off"></i>
          </span>
          <span class="is-hidden-desktop">Login</span>
          </a>
          <a
            class="navbar-item"
            title="Movies"
            v-if="logged"
            @click="gotoPage('/')"
            @mouseover="mouseover = true"
            @mouseleave="mouseover = false"
           >
           <span class="icon">
            <i :class="mouseover ? 'fas fa-spin fa-compact-disc' : 'fas fa-compact-disc'"></i>
          </span>
          <span  class="is-hidden-desktop">Movies</span>
          </a>
          <a
            class="navbar-item"
            title="Admin Panel"
            v-if="logged && admin"
            @click="gotoPage('/','admin')"
           >
           <span class="icon">
            <i class="fas fa-user-shield"></i>
          </span>
          <span  class="is-hidden-desktop">Admin Zone</span>
          </a>
          <a
            class="navbar-item"
            title="Settings"
            v-if="logged"
            @click="gotoPage('/' ,'settings')"
           >
           <span class="icon">
            <i class="fas fa-user-cog"></i>
          </span>
          <span class="is-hidden-desktop"> My Settings</span>
          </a>
          <a
            class="navbar-item"
            title="Logout"
            @click="logout"
            v-if="logged"
           >
           <span class="icon">
            <i class="fas fa-sign-out-alt"></i>
          </span>
          <span class="is-hidden-desktop">Logout</span>
          </a>
          <a
            :class="ismobile ? 'navbar-item' : 'navbar-item is-hidden'"
            @click.stop="$refs.viewMode.toggleMode"
          >
            <viewMode ref="viewMode" />
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ViewMode from "@/layout/viewmode";
import Loading from 'vue-loading-overlay';
export default {
  components: {
    ViewMode,
    Loading,
  },
  created() {
    this.$bus.$on('logged', () => {
      this.loginorout();
      this.changeNavbarStyle()
    })
    this.$bus.$on('logout', () => {
      this.loginorout();
      this.changeNavbarStyle()
    })
    this.loginorout();
    this.active = false;
    this.siteName = document.getElementsByTagName("title")[0].innerText;
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: '/'+index+':',
          index: index,
        };
      });
      this.chooseGD();
    }
    if (window.MODEL) {
      this.param = window.MODEL.q ? window.MODEL.q : "";
    }
  },
  data: function() {
    return {
      siteName: "",
      active: false,
      param: "",
      currgd: {},
      logo: false,
      logoLink: "",
      loading: false,
      navbarStyle: "",
      mouseover: false,
      backgroundClass: "",
      fullpage: true,
      logged: false,
      admin: false,
      superadmin: false,
      gds: [],
      gdindex: '',
      gddropdown: false,
      isActive: false,
      eyes:
        "data:image/png;base64,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",
    };
  },
  methods: {
    chooseGD() {
      let index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
        this.gdindex = this.gds[index].index;
        console.log(this.gdindex);
      }
    },
    changeItem(item) {
      this.currgd = item;
      this.$router.push({
        path: '/'+this.gdindex+':home/',
      });
    },
    query() {
      if (this.param) {
        this.isActive = !this.isActive;
        this.$router.push({
          path: this.currgd.id.match("/[0-9]+:") + "search?q=" + this.param,
        });
      }
    },
    burgerClick() {
      this.isActive = !this.isActive;
    },
    hoverclick() {
      this.active = !this.active
    },
    loginorout() {
      var token = localStorage.getItem("tokendata");
      var user = localStorage.getItem("userdata");
      if (user != null && token != null){
        var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
        if(userData.admin && !userData.superadmin){
            this.logged = true;
            this.admin = true;
        } else if(userData.admin && userData.superadmin){
          this.logged = true;
          this.admin = true;
          this.superadmin = true
        } else {
          this.logged = true
        }
      } else {
        this.logged = false
      }
    },
    homeroute() {
      this.$router.push({ path: '/'+ this.gdindex + ':' + 'home/' })
    },
    gotoPage(url, cmd) {
      this.isActive = !this.isActive;
      this.loading = true;
      if(cmd){
        this.$router.push({ path: '/'+ this.gdindex + ':' + cmd + url })
      } else {
        this.$router.push({ path: '/'+ this.gdindex + ':' + url })
      }
      setTimeout(() => {
        this.loading = false;
      }, 500)
    },
    logout() {
      this.isActive = !this.isActive;
      var token = localStorage.getItem("tokendata")
      var user = localStorage.getItem("userdata");
      if (user != null && token != null){
        localStorage.removeItem("tokendata");
        localStorage.removeItem("userdata");
        this.$bus.$emit("logout", "User Logged Out");
        this.$router.push({ name: 'results' , params: { id: this.gdindex, cmd: "result", success:true, data: "You are Being Logged Out. Please Wait", redirectUrl: '/', tocmd:'home' } })
      }
    },
    changeNavbarStyle() {
      if(this.$route.name == 'home' && !this.logged){
        this.navbarStyle = "transparent"
        this.backgroundClass = "home-back";
      } else {
        this.navbarStyle = "black";
        this.backgroundClass = "none";
      }
    }
  },
  computed: {
    getCurrGD() {
      return this.gds.filter((item) => item.name !== this.currgd.name);
    },
    showSearch() {
// Folder does not support searching
      return window.MODEL ? window.MODEL.root_type < 2 : true
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.changeNavbarStyle();
    this.logo = window.themeOptions.logo;
    if(this.logo){
      this.logoLink = window.themeOptions.logo_link;
    } else {
      this.logoLink = "";
    }
  },
  watch: {
    "$route.params.id": "chooseGD",
    "$route": function() {
      if(this.$route.name == 'home' && !this.logged){
        this.navbarStyle = "transparent";
        this.backgroundClass = "home-back";
      } else {
        this.navbarStyle = "black";
        this.backgroundClass = "none";
      }
    }
  },
};
</script>
