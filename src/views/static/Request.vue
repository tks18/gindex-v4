<template>
  <div class="conten mx-2 mt-2">
    <div class="loading">
      <loading
        :active.sync="loading"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <div class="columns is-vcentered is-centered is-multiline">
      <div
        class="column is centered has-text-centered has-text-white is-two-fifths"
      >
        <article
          :class="
            errormessageVisibility
              ? 'message is-danger'
              : 'message is-hidden is-danger'
          "
        >
          <div class="message-header">
            <p>Error Requesting !!</p>
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
        <h2 class="title has-text-weight-bold has-text-white">
          Request Access
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                id="email"
                v-model="email"
                class="input is-rounded is-focused"
                placeholder="Email"
                type="email"
                required
                autofocus
              />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
              <span class="icon is-small is-right">
                <i class="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                id="name"
                v-model="name"
                class="input is-rounded"
                placeholder="Your Name"
                type="text"
                required
                autofocus
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
              <span class="icon is-small is-right">
                <i class="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <label class="label has-text-white">
              Select the Space for Which Access is Required ?
            </label>
            <div class="control">
              <div class="select is-fullwidth">
                <select id="drive" v-model="drive">
                  <option
                    v-for="(disk, index) in gds"
                    :key="index"
                    :value="index"
                  >
                    {{ disk.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea
                id="message"
                v-model="message"
                class="textarea is-rounded"
                placeholder="Why You Need Access ?"
                rows="3"
                required
              ></textarea>
              <p class="help has-text-netflix-only">
                How did You Know about this and Why do You need?
              </p>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <div class="b-checkbox is-success is-circular is-inline">
                <input
                  id="terms"
                  v-model="checked"
                  class="styled has-text-netflix-only"
                  type="checkbox"
                  name="terms"
                />
                <label for="terms">
                  <span class="content has-text-white">
                    I Accept and Read the
                    <a
                      class="has-text-netflix-only"
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
                  class="styled has-text-netflix-only"
                  type="checkbox"
                  name="terms"
                />
                <label for="code">
                  <span class="content has-text-white">
                    I Accept and Read the
                    <a
                      class="has-text-netflix-only"
                      href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md"
                      target="_blank"
                      >Code of Conduct
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
    </div>
  </div>
</template>
<script>
import { apiRoutes } from '@/utils/backendUtils';
import { getgds } from '@utils/localUtils';
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
      name: '',
      metatitle: 'Request Access',
      email: '',
      emailFocus: '',
      nameFocus: '',
      message: '',
      drive: 0,
      gds: [],
      currgd: {},
      resultmessage: '',
      databasemessage: '',
      checked: '',
      codechecked: '',
      loading: false,
      disabled: true,
      fullpage: true,
      successmessageVisibility: false,
      errormessageVisibility: false,
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
    name: 'validateData',
    email: 'validateData',
    message: 'validateData',
    checked: 'validateData',
    codechecked: 'validateData',
  },
  beforeMount() {
    this.loading = true;
    this.$backend.post(apiRoutes.getSiteSettings).then((response) => {
      if (response.data.auth && response.data.registered) {
        if (response.data.data.requests) {
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
  },
  mounted() {
    if (this.$audio.player() !== undefined) {
      this.$audio.destroy();
    }
    this.checkParams();
  },
  created() {
    const gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  methods: {
    handleSubmit(e) {
      this.metatitle = 'Requesting Access...';
      this.loading = true;
      e.preventDefault();
      if (this.checked) {
        if (this.codechecked) {
          const url = apiRoutes.requestRoute;
          this.$backend
            .post(url, {
              name: this.name,
              email: this.email,
              drives: this.drive,
              message: this.message,
            })
            .then((response) => {
              if (response) {
                if (response.data.auth && response.data.registered) {
                  this.successmessageVisibility = true;
                  this.errormessageVisibility = false;
                  this.loading = false;
                  this.metatitle = 'Success Requesting...';
                  this.resultmessage = response.data.message;
                } else {
                  this.successmessageVisibility = false;
                  this.errormessageVisibility = true;
                  this.loading = false;
                  this.metatitle = 'Request Failed...';
                  this.resultmessage = response.data.message;
                }
              }
            })
            .catch((error) => {
              this.successmessageVisibility = false;
              this.errormessageVisibility = true;
              this.loading = false;
              this.metatitle = 'Request Failed...';
              this.resultmessage = error.data.message;
            });
        } else {
          this.successmessageVisibility = false;
          this.errormessageVisibility = true;
          this.loading = false;
          this.metatitle = 'Request Failed...';
          this.resultmessage = '> You Need to Accept Code of Conduct.';
          this.checked = false;
        }
      } else {
        this.successmessageVisibility = false;
        this.errormessageVisibility = true;
        this.loading = false;
        this.metatitle = 'Request Failed...';
        this.resultmessage = '> You Need to Accept Community Guidelines.';
        this.checked = false;
      }
    },
    checkParams() {
      if (this.$route.params.email) {
        this.email = this.$route.params.email;
        this.emailFocus = false;
        this.nameFocus = true;
      } else {
        this.email = '';
        this.emailFocus = true;
        this.nameFocus = false;
      }
    },
    validateData() {
      const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
      if (
        emailRegex.test(this.email) &&
        this.name.length > 0 &&
        this.message.length > 0 &&
        this.checked &&
        this.codechecked
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
};
</script>
