<template>
  <div class="content mt-3">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Spam Users</h1>
    <div class="loading">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns has-text-centered is-multiline is-centered is-vcentered">
      <div class="column is-full">
        <label class="subtitle has-text-white"> Add / Remove Spam Users</label>
        <div class="control mb-3">
            <input class="is-checkradio is-small is-success" id="addradio" type="radio" name="type" value="add" v-model="type">
            <label for="addradio" class="subtitle has-text-weight-bold has-text-white">Add</label>
            <input class="is-checkradio is-small is-success" id="removeradio" type="radio" name="type" value="remove" v-model="type">
            <label for="removeradio" class="subtitle has-text-weight-bold has-text-white">Remove</label>
        </div>
      </div>
      <div v-if="type == 'add'" class="column is-half">
        <p class="subtitle is-small has-text-white">Add Users to Spam List</p>
        <form @submit.prevent="handleAddSpam">
          <label class="subtitle has-text-white">Select User's Role First</label>
          <div class="control mb-3">
              <input class="is-checkradio is-small is-warning" id="userradio" type="radio" name="addrole" checked value="user" :disabled="roledisabled" v-model="addrole">
              <label for="userradio" class="has-text-white">User</label>
              <input class="is-checkradio is-small is-warning" id="adminradio" type="radio" name="addrole" value="admin" :disabled="roledisabled" v-model="addrole">
              <label for="adminradio" class="has-text-white"> Admin</label>
              <input class="is-checkradio is-small is-warning" id="superadminradio" type="radio" name="addrole" value="superadmin" :disabled="roledisabled" v-model="addrole">
              <label for="superadminradio" class="has-text-white">Superadmin</label>
          </div>
          <div class="field">
            <label class="label has-text-white">Select the User</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="addUserEmail" id="addemail">
                  <option v-for="(user, index) in users" v-bind:key="index">{{user.email}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input is-rounded" id="addpassword" type="password" placeholder="Password" v-model="addpassword" required>
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <button :class=" loading ? 'button is-rounded is-loading is-danger is-medium' : 'button is-rounded is-medium is-danger'">
            <span class="icon is-medium">
              <i class="fas fa-user-minus"></i>
            </span>
            <span>Add to Spam</span>
          </button>
        </form>
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
  data() {
    return {
      user: {},
      admin: false,
      superadmin: false,
      roledisabled: true,
      loading: false,
      addrole: "",
      addpassword: "",
      removerole: "",
      users: [],
      getUserApi: "",
      postAddSpam: "",
      getSpamApi: "",
      addUserEmail: "",
      fullpage: true,
      type: "",
      gds: [],
      currgd: {},
    }
  },
  methods: {
    getUsers() {
      this.loading = true;
      if(this.getUserApi.length > 0){
        this.$http.post(this.getUserApi, {
          email: this.user.email
        }).then(response => {
          if(response.data.auth && response.data.registered){
            this.loading = false;
            this.users = response.data.users;
          } else {
            this.users = [];
            this.loading = false;
          }
        })
      } else {
        this.loading = false;
        console.log("Not Possible")
      }
    },
    handleAddSpam() {
      if(this.addUserEmail.length > 0 && this.addpassword.length > 0){
        this.$http.post(this.postAddSpam, {
          email: this.addUserEmail,
          adminuseremail: this.user.email,
          adminpass: this.addpassword
        }).then(response => {
          console.log(response);
        })
      }
    }
  },
  beforeMount() {
    this.loading = true;
    var user = localStorage.getItem("userdata");
    var token = localStorage.getItem("tokendata");
    if(user && token){
      var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
      this.user = userData;
      this.loading = false;
    } else {
      this.user = null;
      this.loading = false;
    }
  },
  mounted(){
    this.loading = true;
    if(this.user.admin && this.user.superadmin){
      this.admin = true, this.superadmin = true, this.roledisabled = false, this.loading = false;
      this.addrole = "user";
      this.getUserApi = window.apiRoutes.getUsers;
      this.postAddSpam = window.apiRoutes.addSpamUser;
      this.getSpamApi = window.apiRoutes.getSpamUsers;
      this.getUsers();
    } else if(this.user.admin && !this.user.superadmin) {
      this.admin = true, this.superadmin = false, this.loading = false;
      this.addrole = "user";
      this.getUserApi = window.apiRoutes.getUsers;
      this.postAddSpam = window.apiRoutes.addSpamUser;
      this.getSpamApi = window.apiRoutes.getSpamUsers;
      this.getUsers();
    } else {
      this.loading = false;
      this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", success: false, data: "UnAuthorized Route. Not Allowed.", redirectUrl: "/", tocmd: "home" } })
    }
  },
  created() {
    if (window.gds) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      let index = this.$route.params.id;
      if (this.gds) {
        this.currgd = this.gds[index];
      }
    }
  },
  watch: {
    addrole: function() {
      if(this.addrole == "user"){
        this.getUserApi = window.apiRoutes.getUsers;
        this.postAddSpam = window.apiRoutes.addSpamUser;
        this.getUsers();
      } else if(this.addrole == "admin"){
        this.getUserApi = window.apiRoutes.getAdmins;
        this.postAddSpam = window.apiRoutes.addSpamAdmin;
        this.getUsers();
      } else if(this.addrole == "superadmin"){
        this.getUserApi = window.apiRoutes.getSuperAdmins;
        this.postAddSpam = window.apiRoutes.addSpamSuperAdmin;
        this.getUsers();
      }
    },
    removerole: function() {
      if(this.removerole == "user"){
        this.getSpamApi = window.apiRoutes.getSpamUsers;
      } else if(this.removerole == "admin"){
        this.getSpamApi = window.apiRoutes.getSpamAdmins;
      } else if(this.removerole == "superadmin"){
        this.getSpamApi = window.apiRoutes.getSpamSuperadmins;
      }
    }
  }
}
</script>
