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
        <form @submit.prevent="">
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
                <select v-model="addUserEmail" id="drive">
                  <option >Summa</option>
                </select>
              </div>
            </div>
          </div>
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
      addUserEmail: "",
      fullpage: true,
      type: "",
      gds: [],
      currgd: {},
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
    } else if(this.user.admin && !this.user.superadmin) {
      this.admin = true, this.superadmin = false, this.loading = false;
      this.addrole = "user";
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
}
</script>
