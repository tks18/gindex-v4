<template>
  <div>
    <div class="content">
      <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Your Users</h1>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns mx-3 is-mobile is-multiline is-vcentered">
        <div class="column is-full">
          <div class="columns is-desktop is-multiline is-vcentered">
            <div class="column has-text-centered is-3">
              <form @submit.prevent="">
                <p class="control has-icons-right">
                  <input class="input is-rounded" placeholder="Enter User's Email" id="email" type="email" v-model="searchText">
                  <span class="icon is-small is-right">
                    <i class="fas fa-search"></i>
                  </span>
                </p>
              </form>
            </div>
            <div class="column is-3 is-hidden-mobile is-hidden-touch">
              asdas
            </div>
            <div class="column is-3 is-hidden-mobile is-hidden-touch">
              asdas
            </div>
            <div class="column has-text-centered is-3">
              <button @click="handleRefresh" :class=" loading ? 'button is-rounded is-loading is-warning' : 'button is-rounded is-warning'">
                <span class="icon">
                  <i class="fas fa-sync"></i>
                </span>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        <div :class=" usermodal ? 'modal is-active' : 'modal'">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title has-text-centered">{{ currentUser.name }}</p>
              <button class="delete" aria-label="close" @click="closeUserModal"></button>
            </header>
            <section class="modal-card-body">
              <div class="columns is-mobile is-centered is-vcentered is-multiline">
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Name</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.name }}</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Email</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.email }}</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Role</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.role }}</p>
                </div>
                <div class="column is-quarter has-text-centered">
                  <button class="button is-rounded is-danger" @click="showInput = true;">
                    Delete
                  </button>
                </div>
                <div class="column is-quarter has-text-centered">
                  <button class="button is-rounded is-danger" >
                    Upgrade the User
                  </button>
                </div>
                <div v-if="showInput" class="column is-full">
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input is-rounded is-danger" id="password" type="password" placeholder="Password" v-model="password">
                      <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div v-if="users.length > 0" class="column is-full">
          <table class="table">
            <thead>
              <tr>
                <th class="has-text-white" >Name</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >Email</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >Role</th>
                <th class="has-text-white" >Action</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th class="has-text-white">Total Users</th>
                <th class="has-text-white">{{ searchedUsers.length }}</th>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="(user, index) in searchedUsers" v-bind:key="index">
                <th class="has-text-white" >{{ user.name }}</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >{{ user.email.slice(0,30) }}</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >{{ user.role }}</th>
                <th class="has-text-white" >
                  <button class="button is-danger is-rounded" @click="userModal(user)">
                    View
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="column is-full">
          <p class="subtitle has-text-centered has-text-white">Please Click Refresh Button to Load Users</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
export default {
  components: {
    Loading,
  },
  data(){
    return {
      user: {},
      token: {},
      users: [],
      password: "",
      showInput: false,
      currentUser: {},
      usermodal: false,
      searchedUsers: [],
      apiurl: "",
      searchText: "",
      admin: false,
      superadmin: false,
      loading: false,
      fullpage: true,
    }
  },
  methods: {
    handleRefresh() {
      this.loading = true;
      if(this.apiurl.length > 0){
        this.$http.post(this.apiurl, {
            email: this.user.email,
        }).then(response => {
          if(response.data.auth && response.data.registered){
            this.loading = false;
            this.users = response.data.users;
            this.searchedUsers = response.data.users;
          }
        })
      } else {

      }
    },
    handleDelete() {

    },
    userModal(user){
      this.usermodal = true;
      this.currentUser = user;
    },
    closeUserModal() {
      this.usermodal = false; 
      this.currentUser = {};
      this.showInput = false;
      this.password = "";
    }
  },
  beforeMount() {
    this.loading = true;
    var token = localStorage.getItem("tokendata")
    var user = localStorage.getItem("userdata");
    if (user != null && token != null){
      var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
      var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
      this.user = userData, this.token = tokenData, this.loading = false;
    } else {
      this.user = null, this.token = null, this.loading = false;
    }
  },
  mounted() {
    if(this.user.admin && this.user.superadmin){
      this.admin = true, this.superadmin = true,this.loading = false;
      this.apiurl = window.apiRoutes.getAll;
    } else if(this.user.admin && !this.user.superadmin) {
      this.admin = true, this.superadmin = false,this.loading = false;
      this.apiurl = window.apiRoutes.getUsers;
    } else {
      this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", data: "UnAuthorized Route.", redirectUrl: "/", tocmd: 'home' } })
    }
  },
  watch: {
    searchText: function(){
      if(this.users.length){
        var escapedSearch = this.searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var searchRegex = new RegExp(escapedSearch,"g")
        this.searchedUsers = this.users.filter(user => {
          return searchRegex.test(user.email)
        })
      } else {

      }
    }
  }
}
</script>
