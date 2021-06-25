<template>
  <div
    :class="
      ismobile
        ? 'content mx-1 mt-2 px-0 is-clipped'
        : 'content ml-5 mt-2 mr-5 pl-5 pr-5 is-clipped'
    "
  >
    <div class="loading">
      <loading
        :active.sync="loading"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <div class="columns is-vcentered is-centered is-multiline">
      <div class="column is-half has-text-centered has-text-white">
        <div :class="adminmodal ? 'modal is-active' : 'modal'">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title has-text-centered">Admin Features</p>
              <button
                class="delete"
                aria-label="close"
                @click="adminmodal = false"
              ></button>
            </header>
            <section class="modal-card-body">
              <div class="columns is-multiline is-desktop">
                <div class="column is-full">
                  <p class="subtitle has-text-weight-bold has-text-centered">
                    Features
                  </p>
                </div>
                <div class="column is-full">
                  <p class="subtitle has-text-weight-semibold">
                    Permissions Related to New Users:
                  </p>
                </div>
                <div class="column is-full has-text-left">
                  <ul>
                    <li class="has-text-black">Accept New Users</li>
                    <li class="has-text-black">
                      Invite New Users through Glory to Heaven Mail Service.
                    </li>
                  </ul>
                </div>
                <div class="column is-full">
                  <p class="subtitle has-text-weight-semibold">
                    Permission Related to Existing Users:
                  </p>
                </div>
                <div class="column is-full has-text-left">
                  <ul>
                    <li class="has-text-black">Delete a User</li>
                    <li class="has-text-black">Add a User to Spam</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
        <article
          :class="
            errorMessage ? 'message is-danger' : 'message is-hidden is-danger'
          "
        >
          <div class="message-header">
            <p>Error Logging in!!</p>
            <button
              class="delete"
              aria-label="delete"
              @click="errorMessage = false"
            ></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
        <article
          :class="
            successMessage
              ? 'message is-success'
              : 'message is-hidden is-success'
          "
        >
          <div class="message-header">
            <p>Success !</p>
            <button
              class="delete"
              aria-label="delete"
              @click="successMessage = false"
            ></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
        <h2 class="title has-text-weight-bold has-text-white">
          Request Access
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="control mb-3">
            <input
              id="adminradio"
              v-model="role"
              class="is-checkradio is-small is-warning"
              type="radio"
              name="role"
              value="admin"
              disabled
            />
            <label for="adminradio"> Admin</label>
            <input
              id="superadminradio"
              v-model="role"
              class="is-checkradio is-small is-warning"
              type="radio"
              name="role"
              value="superadmin"
              disabled
            />
            <label for="superadminradio">Superadmin</label>
          </div>
          <div class="field">
            <div class="control">
              <textarea
                id="message"
                v-model="message"
                class="textarea is-success is-rounded"
                placeholder="Why You Need More Previleges ?"
                rows="3"
                required
              ></textarea>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <div class="b-checkbox is-success is-circular is-inline">
                <input
                  id="terms"
                  v-model="checked"
                  class="styled has-text-success"
                  type="checkbox"
                  name="terms"
                />
                <label for="terms">
                  <span class="content has-text-white">
                    I Accept and Read the
                    <a
                      class="has-text-success"
                      href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md"
                      target="_blank"
                    >
                      Community Guidelines
                    </a>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <div class="b-checkbox is-success is-circular is-inline">
                <input
                  id="code"
                  v-model="codechecked"
                  class="styled has-text-success"
                  type="checkbox"
                  name="terms"
                />
                <label for="code">
                  <span class="content has-text-white">
                    I Accept and Read the
                    <a
                      class="has-text-success"
                      href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md"
                      target="_blank"
                    >
                      Code of Conduct
                    </a>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <button
            :class="
              loading
                ? 'button is-loading is-rounded is-netflix-red is-medium'
                : 'button is-netflix-red is-rounded is-medium'
            "
            type="submit"
            :disabled="disabled"
          >
            <span class="icon">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>Request Access</span>
          </button>
        </form>
      </div>
      <div class="column is-half">
        <div class="columns is-multiline is-desktop is-centered">
          <div class="column is-full">
            <div class="box has-background-warning">
              <h2
                class="title has-text-black has-text-centered has-text-weight-bold"
              >
                Request More Previleges
              </h2>
              <div class="content">
                <span class="subtitle has-text-weight-bold has-text-centered">
                  Ahh ! Why You need to Have More Access to this Website.
                </span>
              </div>
            </div>
            <div :class="superadminmodal ? 'modal is-active' : 'modal'">
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title has-text-centered">
                    Super Admin Features
                  </p>
                  <button
                    class="delete"
                    aria-label="close"
                    @click="superadminmodal = false"
                  ></button>
                </header>
                <section class="modal-card-body">
                  <div class="columns is-multiline is-desktop">
                    <div class="column is-full">
                      <p
                        class="subtitle has-text-weight-bold has-text-centered"
                      >
                        Features
                      </p>
                    </div>
                    <div class="column is-full">
                      <p
                        class="subtitle has-text-weight-semibold has-text-centered"
                      >
                        Permissions Related to New Users:
                      </p>
                    </div>
                    <div class="column is-full">
                      <ul>
                        <li class="has-text-black">Accept New Users</li>
                        <li class="has-text-black">
                          Invite New Users through Glory to Heaven Mail Service.
                        </li>
                      </ul>
                    </div>
                    <div class="column is-full">
                      <p
                        class="subtitle has-text-weight-semibold has-text-centered"
                      >
                        Granting Permissions to Existing Users:
                      </p>
                    </div>
                    <div class="column is-full">
                      <ul>
                        <li>Promote a User to Admin</li>
                        <li>Promote a Admin to Superadmin</li>
                        <li>
                          Invite a Admin for Superadmin Role throught Glory to
                          Heaven mail Service
                        </li>
                        <li>
                          Invite a user for Admin Role throught Glory to Heaven
                          mail Service
                        </li>
                      </ul>
                    </div>
                    <div class="column is-full">
                      <p
                        class="subtitle has-text-weight-semibold has-text-centered"
                      >
                        Permission Related to Existing Users:
                      </p>
                    </div>
                    <div class="column is-full">
                      <ul>
                        <li>Delete a User</li>
                        <li>Delete a Admin</li>
                        <li>Delete a Superadmin</li>
                        <li>Add a User to Spam</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div class="box has-background-danger">
              <h2
                class="title has-text-white has-text-centered has-text-weight-bold"
              >
                What Previleges You Get?
              </h2>
              <p class="subtitle has-text-weight-bold has-text-centered">
                Click the Below Buttons to See the Features
              </p>
              <div class="columns is-multiline is-mobile is-centered">
                <div v-if="!admin && !superadmin" class="column is-two-thirds">
                  <p class="subtitle has-text-white">For Admin Features</p>
                </div>
                <div v-if="!admin && !superadmin" class="column is-one-third">
                  <button
                    class="button is-rounded is-netflix-red has-text-white"
                    @click="adminmodal = true"
                  >
                    <span class="icon is-small">
                      <i class="fas fa-sticky-note"></i>
                    </span>
                    <span class="content">Click Here</span>
                  </button>
                </div>
                <div v-if="admin && !superadmin" class="column is-two-thirds">
                  <p class="subtitle has-text-white">For Superadmin Features</p>
                </div>
                <div v-if="admin && !superadmin" class="column is-one-third">
                  <button
                    class="button is-rounded is-netflix-red has-text-white"
                    @click="superadminmodal = true"
                  >
                    <span class="icon is-small">
                      <i class="fas fa-sticky-note"></i>
                    </span>
                    <span class="content">Click Here</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { initializeUser, getgds } from '@utils/localUtils';
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

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
  props: {
    nextUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      metatitle: 'Previlege Request',
      user: {},
      admin: false,
      superadmin: false,
      resultmessage: '',
      checked: '',
      codechecked: '',
      disabled: '',
      gds: [],
      currgd: {},
      adminmodal: false,
      superadminmodal: false,
      errorMessage: false,
      successMessage: false,
      role: '',
      apiurl: '',
      loading: false,
      fullpage: true,
      message: '',
    };
  },
  computed: {
    ismobile() {
      const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width > 966) {
        return false;
      }
      return true;
    },
    siteName() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
  },
  watch: {
    role: 'validateData',
    message: 'validateData',
    checked: 'validateData',
    codechecked: 'validateData',
  },
  beforeMount() {
    this.loading = true;
    this.$backend.post(apiRoutes.getSiteSettings).then((response) => {
      if (response.data.auth && response.data.registered) {
        if (response.data.data.adminRequests) {
          this.loading = false;
        } else {
          this.loading = false;
          this.$router.push({
            name: 'results',
            params: {
              id: this.currgd.id,
              cmd: 'result',
              success: false,
              data:
                'User Requests are Closed by the Admin. Please Try Afterwards or Contact Admins.',
              noredirect: true,
            },
          });
        }
      } else {
        this.loading = false;
      }
    });
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
    if (!this.admin && !this.superadmin) {
      this.apiurl = apiRoutes.requestadminroute;
      this.role = 'admin';
      this.loading = false;
    } else if (this.admin && !this.superadmin) {
      this.apiurl = apiRoutes.requestsuperadminroute;
      this.role = 'superadmin';
      this.loading = false;
    } else {
      this.loading = false;
      this.$router.push({
        name: 'results',
        params: {
          id: this.currgd.id,
          cmd: 'result',
          success: false,
          data: 'You are Already a Admin or SuperAdmin',
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
    handleSubmit(e) {
      this.metatitle = 'Verifying Your Details..';
      this.loading = true;
      e.preventDefault();
      if (this.checked && this.codechecked) {
        this.$backend
          .post(
            this.apiurl,
            {
              name: this.user.name,
              email: this.user.email,
              message: this.message,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (response) {
              if (response.data.auth && response.data.registered) {
                this.successMessage = true;
                this.errorMessage = false;
                this.metatitle = 'Request Sent...';
                this.loading = false;
                this.resultmessage = response.data.message;
              } else {
                this.successMessage = false;
                this.errorMessage = true;
                this.metatitle = 'Request Failed...';
                this.loading = false;
                this.resultmessage = response.data.message;
              }
            }
          })
          .catch((error) => {
            this.successMessage = false;
            this.errorMessage = true;
            this.metatitle = 'Request Failed...';
            this.loading = false;
            this.resultmessage = error.data.message;
          });
      } else {
        this.successMessage = false;
        this.errorMessage = true;
        this.metatitle = 'Request Failed...';
        this.loading = false;
        this.resultmessage = 'You Need to Accept Community Guidelines.';
      }
    },
    validateData() {
      if (
        this.role.length > 0 &&
        this.checked &&
        this.codechecked &&
        this.message.length > 0
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
};
</script>
