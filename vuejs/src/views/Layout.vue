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
import { initializeUser } from "@utils/localUtils";
import Head from "./common/Head";
import Footer from "./common/Footer";
export default {
  data: function () {
    return {
      showInfo: true,
      logged: false,
    };
  },
  components: {
    Head,
    Footer: Footer,
  },
  methods: {
    assignUserInfo() {
      var userData = initializeUser();
      if(userData.isThere){
        this.logged = userData.data.logged;
      } else {
        this.logged = userData.data.logged;
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
    this.$ga.event({eventCategory: "Website Started",eventAction: "Normal - ",eventLabel: "Main",nonInteraction: true})
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
