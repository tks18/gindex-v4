<template>
  <div>
    <section class="section mx-0 my-0 px-0 py-0">
      <Head v-if="showInfo"></Head>
        <!-- <keep-alive> -->
        <feb-alive>
            <router-view ></router-view>
        </feb-alive>
        <!-- </keep-alive> -->
        <Footer v-if="showInfo"></Footer>
    </section>
  </div>
</template>

<script>
import Head from "./common/Head";
import Footer from "./common/Footer";
export default {
  data: function () {
    return {
      showInfo: true,
    };
  },
  components: {
    Head,
    Footer: Footer,
  },
  methods: {
    assignUserInfo() {
      this.loading = true;
      var token = localStorage.getItem("tokendata");
      var user = localStorage.getItem("userdata");
      var hyBridToken = localStorage.getItem("hybridToken");
      if(hyBridToken && hyBridToken != null || hyBridToken != undefined){
        const hybridData = JSON.parse(this.$hash.AES.decrypt(hyBridToken, this.$pass).toString(this.$hash.enc.Utf8))
        console.log(hybridData);
        if(hybridData.user){
          this.logged = true;
        } else {
          this.logged = false;
          localStorage.removeItem("hybridToken");
          this.gotoPage("/", "login")
        }
      } else if (user != null && token != null){
        var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
        if(userData.email){
          this.logged = true;
        } else {
          this.logged = false;
        }
      } else {
        this.logged = false

      }
    },
    changeFooter() {
      if(this.$route.name == 'home' && !this.logged){
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    }
  },
  beforeMount() {
    this.assignUserInfo();
    this.changeFooter();
  },
  created() {
    this.$bus.$on('logged', () => {
      this.assignUserInfo();
      this.changeFooter()
    })
    this.$bus.$on('logout', () => {
      this.changeFooter()
      this.assignUserInfo();
    })
  },
  updated() {
    this.changeFooter()
    this.assignUserInfo();
  },
  watch: {
    "$route": function() {
      if(this.$route.name == 'home' && !this.logged){
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    }
  },
};
</script>
