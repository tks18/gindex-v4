<template>
  <div class="content mt-3">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">
      Manage Spam Users
    </h1>
    <div class="loading">
      <loading
        :active.sync="loading"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <div
      class="columns has-text-centered is-multiline is-centered is-vcentered"
    >
      <div class="column is-two-thirds">
        <div class="control mb-3 my-1">
          <input
            id="addradio"
            v-model="type"
            class="is-checkradio is-small is-success mx-1"
            type="radio"
            name="type"
            value="add"
          />
          <label
            for="addradio"
            class="subtitle has-text-weight-bold has-text-white mx-1"
          >
            Add
          </label>
          <input
            id="removeradio"
            v-model="type"
            class="is-checkradio is-small is-success mx-1"
            type="radio"
            name="type"
            value="remove"
          />
          <label
            for="removeradio"
            class="subtitle has-text-weight-bold has-text-white mx-1"
          >
            Remove
          </label>
        </div>
        <article
          :class="
            errormessageVisibility
              ? 'message is-danger'
              : 'message is-hidden is-danger'
          "
        >
          <div class="message-header">
            <p>Error Logging in!!</p>
            <button
              class="delete"
              aria-label="delete"
              @click="errormessageVisibility = false"
            ></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
        <article
          :class="
            successmessageVisibility
              ? 'message is-success'
              : 'message is-hidden is-success'
          "
        >
          <div class="message-header">
            <p>Success !</p>
            <button
              class="delete"
              aria-label="delete"
              @click="successmessageVisibility = false"
            ></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
      </div>
      <div v-if="type == 'add'" class="column is-half">
        <p class="subtitle is-small has-text-white">Add Users to Spam List</p>
        <form @submit.prevent="handleAddSpam">
          <label class="subtitle has-text-white">
            Select User's Role First
          </label>
          <div class="control mb-3 my-1">
            <input
              id="useraddradio"
              v-model="addrole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              checked
              value="user"
              :disabled="roledisabled"
            />
            <label for="useraddradio" class="has-text-white mx-1">User</label>
            <input
              id="adminaddradio"
              v-model="addrole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              value="admin"
              :disabled="roledisabled"
            />
            <label for="adminaddradio" class="has-text-white mx-1">
              Admin
            </label>
            <input
              id="superadminaddradio"
              v-model="addrole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              value="superadmin"
              :disabled="roledisabled"
            />
            <label for="superadminaddradio" class="has-text-white mx-1">
              Superadmin
            </label>
          </div>
          <div class="field">
            <label class="label has-text-white">Select the User</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select id="addemail" v-model="addUserEmail">
                  <option
                    v-for="(addUser, index) in users"
                    :key="index"
                    placeholder="Select the User"
                  >
                    {{ addUser.email }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea
                id="message"
                v-model="addmessage"
                class="textarea is-success is-rounded"
                placeholder="Reason for Adding Him"
                rows="3"
                required
              ></textarea>
            </div>
          </div>
          <button
            :class="
              loading
                ? 'button is-rounded is-loading is-netflix-red is-medium'
                : 'button is-rounded is-medium is-netflix-red'
            "
          >
            <span class="icon is-medium">
              <i class="fas fa-user-minus"></i>
            </span>
            <span>Add to Spam</span>
          </button>
        </form>
      </div>
      <div v-if="type == 'remove'" class="column is-half">
        <p class="subtitle is-small has-text-white">Remove Users from Spam</p>
        <form @submit.prevent="handleRemoveSpam">
          <label class="subtitle has-text-white">
            Select User's Role First
          </label>
          <div class="control mb-3 my-1">
            <input
              id="userremradio"
              v-model="removerole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              checked
              value="user"
              :disabled="roledisabled"
            />
            <label for="userremradio" class="has-text-white mx-1">User</label>
            <input
              id="adminremradio"
              v-model="removerole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              value="admin"
              :disabled="roledisabled"
            />
            <label for="adminremradio" class="has-text-white mx-1">
              Admin
            </label>
            <input
              id="superadminremradio"
              v-model="removerole"
              class="is-checkradio is-small is-warning mx-1"
              type="radio"
              name="addrole"
              value="superadmin"
              :disabled="roledisabled"
            />
            <label for="superadminremradio" class="has-text-white mx-1">
              Superadmin
            </label>
          </div>
          <div class="field">
            <label class="label has-text-white">Select the User</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select id="removeemail" v-model="removeUserEmail">
                  <option
                    v-for="(removeUser, index) in spamUsers"
                    :key="index"
                    placeholder="Select the User"
                  >
                    {{ removeUser.email }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <button
            :class="
              loading
                ? 'button is-rounded is-loading is-netflix-red is-medium'
                : 'button is-rounded is-medium is-netflix-red'
            "
          >
            <span class="icon is-medium">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>Allow Him</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { initializeUser, getgds } from '@utils/localUtils';
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import Loading from 'vue-loading-overlay';

export default {
  components: {
    Loading,
  },
  metaInfo() {
    return {
      title: this.metatitle,
      titleTemplate: (titleChunk) => {
        if (titleChunk && this.siteName) {
          return titleChunk
            ? `${titleChunk} | ${this.siteName}`
            : `${this.siteName}`;
        }
        return 'Loading...';
      },
    };
  },
  data() {
    return {
      metatitle: 'Manage Spam',
      user: {},
      admin: false,
      superadmin: false,
      roledisabled: true,
      loading: false,
      addrole: '',
      addmessage: '',
      removerole: '',
      removeUserEmail: '',
      users: [],
      spamUsers: [],
      getUserApi: '',
      postAddSpam: '',
      getSpamApi: '',
      postSpamApi: '',
      addUserEmail: '',
      fullpage: true,
      errormessageVisibility: false,
      successmessageVisibility: false,
      resultmessage: '',
      type: '',
      gds: [],
      currgd: {},
    };
  },
  computed: {
    siteName() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
  },
  watch: {
    addrole() {
      if (this.addrole === 'user') {
        this.getUserApi = apiRoutes.getUsers;
        this.postAddSpam = apiRoutes.addSpamUser;
        this.getUsers();
      } else if (this.addrole === 'admin') {
        this.getUserApi = apiRoutes.getAdmins;
        this.postAddSpam = apiRoutes.addSpamAdmin;
        this.getUsers();
      } else if (this.addrole === 'superadmin') {
        this.getUserApi = apiRoutes.getSuperAdmins;
        this.postAddSpam = apiRoutes.addSpamSuperAdmin;
        this.getUsers();
      }
    },
    removerole() {
      if (this.removerole === 'user') {
        this.getSpamApi = apiRoutes.getSpamUsers;
        this.postSpamApi = apiRoutes.removeSpamUser;
        this.getSpamUsers();
      } else if (this.removerole === 'admin') {
        this.getSpamApi = apiRoutes.getSpamAdmins;
        this.postSpamApi = apiRoutes.removeSpamAdmin;
        this.getSpamUsers();
      } else if (this.removerole === 'superadmin') {
        this.getSpamApi = apiRoutes.getSpamSuperadmins;
        this.postSpamApi = apiRoutes.removeSpamSuperadmin;
        this.getSpamUsers();
      }
    },
  },
  beforeMount() {
    this.loading = true;
    const userData = initializeUser();
    if (userData.isThere) {
      if (userData.type === 'normal') {
        this.user = userData.data.user;
        this.token = userData.data.token;
        this.logged = userData.data.logged;
        this.loading = userData.data.loading;
        this.admin = userData.data.admin;
        this.superadmin = userData.data.superadmin;
      }
    } else {
      this.logged = userData.data.logged;
      this.loading = userData.data.loading;
    }
  },
  mounted() {
    this.loading = true;
    if (this.admin && this.superadmin) {
      this.addrole = 'user';
      this.removerole = 'user';
      this.roledisabled = false;
      this.getUserApi = apiRoutes.getUsers;
      this.postAddSpam = apiRoutes.addSpamUser;
      this.getSpamApi = apiRoutes.getSpamUsers;
      this.postSpamApi = apiRoutes.removeSpamUser;
      this.getUsers();
      this.getSpamUsers();
      this.loading = false;
    } else if (this.admin && !this.superadmin) {
      this.addrole = 'user';
      this.removerole = 'user';
      this.getUserApi = apiRoutes.getUsers;
      this.postAddSpam = apiRoutes.addSpamUser;
      this.getSpamApi = apiRoutes.getSpamUsers;
      this.postSpamApi = apiRoutes.removeSpamUser;
      this.getUsers();
      this.getSpamUsers();
      this.loading = false;
    } else {
      this.loading = false;
      this.$router.push({
        name: 'results',
        params: {
          id: this.currgd.id,
          cmd: 'result',
          success: false,
          data: 'UnAuthorized Route. Not Allowed.',
          redirectUrl: '/',
          tocmd: 'home',
        },
      });
    }
  },
  created() {
    const gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  methods: {
    getUsers() {
      this.metatitle = 'Getting Users...';
      this.loading = true;
      if (this.getUserApi.length > 0) {
        this.$backend
          .post(
            this.getUserApi,
            {
              email: this.user.email,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (response.data.auth && response.data.registered) {
              this.loading = false;
              this.metatitle = 'Got Users...';
              this.users = response.data.users;
            } else {
              this.metatitle = 'Request Failed...';
              this.users = [];
              this.loading = false;
            }
          });
      } else {
        this.loading = false;
        this.metatitle = 'Request Failed...';
      }
    },
    getSpamUsers() {
      this.metatitle = 'Getting Spammers...';
      this.loading = true;
      if (this.getUserApi.length > 0) {
        this.$backend
          .post(
            this.getSpamApi,
            {
              adminuseremail: this.user.email,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (response.data.auth && response.data.registered) {
              this.loading = false;
              this.metatitle = 'Done...';
              this.spamUsers = response.data.users;
            } else {
              this.spamUsers = [];
              this.metatitle = 'Failed...';
              this.loading = false;
            }
          });
      } else {
        this.loading = false;
        this.metatitle = 'Failed...';
      }
    },
    handleAddSpam() {
      this.metatitle = 'Adding Spammers...';
      this.loading = true;
      if (this.addUserEmail.length > 0) {
        this.$backend
          .post(
            this.postAddSpam,
            {
              email: this.addUserEmail,
              message: this.addmessage,
              adminuseremail: this.user.email,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (response.data.auth && response.data.registered) {
              this.successmessageVisibility = true;
              this.errormessageVisibility = false;
              this.metatitle = 'Success...';
              this.resultmessage = response.data.message;
              this.loading = false;
            } else {
              this.successmessageVisibility = false;
              this.errormessageVisibility = true;
              this.metatitle = 'Failed...';
              this.resultmessage = response.data.message;
              this.loading = false;
            }
          });
      }
    },
    handleRemoveSpam() {
      this.metatitle = 'Removing Spammers...';
      this.loading = true;
      if (this.removeUserEmail.length > 0) {
        this.$backend
          .post(
            this.postSpamApi,
            {
              email: this.removeUserEmail,
              adminuseremail: this.user.email,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (response.data.auth && response.data.deleted) {
              this.successmessageVisibility = true;
              this.errormessageVisibility = false;
              this.metatitle = 'Done...';
              this.resultmessage = response.data.message;
              this.loading = false;
            } else {
              this.metatitle = 'Failed...';
              this.successmessageVisibility = false;
              this.errormessageVisibility = true;
              this.resultmessage = response.data.message;
              this.loading = false;
            }
          });
      } else {
        this.metatitle = 'Failed...';
      }
    },
  },
};
</script>
