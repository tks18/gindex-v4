<template>
  <div
    :class="
      ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5'
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
      <div :class="modal ? 'modal is-active' : 'modal'">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title has-text-centered">Forgot Password</p>
            <button
              class="delete"
              aria-label="close"
              @click="modal = false"
            ></button>
          </header>
          <section class="modal-card-body">
            <article
              :class="
                forgotErrorMessage
                  ? 'message is-danger'
                  : 'message is-hidden is-danger'
              "
            >
              <div class="message-header">
                <p>Error Processing !</p>
                <button
                  class="delete"
                  aria-label="delete"
                  @click="forgotErrorMessage = false"
                ></button>
              </div>
              <div class="message-body">
                {{ forgotMessage }}
              </div>
            </article>
            <article
              :class="
                forgotSuccessMessage
                  ? 'message is-success'
                  : 'message is-hidden is-success'
              "
            >
              <div class="message-header">
                <p>Success !</p>
                <button
                  class="delete"
                  aria-label="delete"
                  @click="forgotSuccessMessage = false"
                ></button>
              </div>
              <div class="message-body">
                {{ forgotMessage }}<br />
                <span
                  class="forgot-pass is-medium has-text-weight-bold"
                  style="cursor: pointer"
                  @click="gotoPage('/otp/', 'register')"
                  >Click Here to Enter OTP
                </span>
              </div>
            </article>
            <form @submit.prevent="handleForgotPass">
              <div
                class="columns is-centered is-desktop is-multiline is-vcentered"
              >
                <div class="column is-two-thirds">
                  <div class="field">
                    <p class="control has-icons-left has-icons-right">
                      <input
                        id="foremail"
                        v-model="forgotEmail"
                        class="input is-rounded"
                        placeholder="Enter Your Account Email"
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
                </div>
                <div class="column has-text-centered is-two-thirds">
                  <button
                    :class="
                      loading
                        ? 'button is-rounded is-loading is-netflix-red'
                        : 'button is-rounded is-netflix-red'
                    "
                  >
                    <span class="icon">
                      <i class="fas fa-user-plus"></i>
                    </span>
                    <span>Get OTP</span>
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
      <div class="column is centered has-text-centered has-text-white is-half">
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
        <h2 class="title has-text-weight-bold has-text-white">Login</h2>
        <form @submit.prevent="handleSubmit">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                id="logemail"
                v-model="email"
                class="input is-rounded"
                placeholder="Email"
                autocomplete="username"
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
            <p class="control has-icons-left">
              <input
                id="logpassword"
                v-model="password"
                class="input is-rounded"
                autocomplete="current-password"
                type="password"
                placeholder="Password"
                required
              />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <p
            class="help subtitle has-text-weight-bold forgot-pass has-text-right has-text-netflix"
            style="cursor: pointer"
            @click="modal = true"
          >
            Forgot Password ?
          </p>
          <button
            :class="
              loading
                ? 'button is-rounded is-loading is-netflix-red is-medium'
                : 'button is-rounded is-medium is-netflix-red'
            "
            :disabled="disabled"
          >
            <span class="icon is-medium">
              <i class="fas fa-shipping-fast"></i>
            </span>
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  decodeSecret,
  encodeSecret,
  getItem,
  setItem,
} from '@utils/encryptUtils';
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
  data() {
    return {
      email: '',
      password: '',
      hypassword: '',
      disabled: true,
      metatitle: 'Login',
      modal: false,
      forgotEmail: '',
      forgotMessage: '',
      forgotErrorMessage: false,
      forgotSuccessMessage: false,
      emailFocus: true,
      gds: [],
      hyInput: false,
      currgd: {},
      passwordFocus: false,
      resultmessage: '',
      databasemessage: '',
      loading: false,
      fullpage: true,
      errormessageVisibility: false,
      successmessageVisibility: false,
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
    email: 'validateData',
    password: 'validateData',
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
      this.metatitle = 'Logging You In...';
      this.loading = true;
      e.preventDefault();
      if (this.password.length > 0 && this.email.length > 0) {
        this.$backend
          .post(apiRoutes.loginRoute, {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.data.auth && response.data.registered) {
              this.metatitle = 'Success...';
              setItem(
                'tokendata',
                encodeSecret(
                  JSON.stringify({
                    token: response.data.token,
                    issuedate: response.data.issuedat,
                    expirydate: response.data.expiryat,
                  }),
                ),
              );
              setItem(
                'userdata',
                encodeSecret(JSON.stringify(response.data.tokenuser)),
              );
              setItem(
                'sessiondata',
                encodeSecret(JSON.stringify(response.data.sessiondata)),
              );
              const token = getItem('tokendata');
              const user = getItem('userdata');
              const session = getItem('sessiondata');
              if (token != null && user != null && session != null) {
                const tokenData = JSON.parse(decodeSecret(token));
                const userData = JSON.parse(decodeSecret(user));
                this.loading = false;
                this.errormessageVisibility = false;
                this.successmessageVisibility = true;
                this.resultmessage = `Logged in Successfully as ${
                  userData.name
                }. Your token will expire at ${this.$moment(
                  tokenData.expirydate,
                ).format('dddd, MMMM Do YYYY [at] hh:mm A')}.`;
                this.$parent.$bus.$emit('logged', 'User Logged');
                this.$notify({
                  title: 'Success',
                  message: 'Successfully Logged in',
                  type: 'success',
                });
                setTimeout(() => {
                  if (this.$route.params.nextUrl != null) {
                    this.$router.push({
                      name: 'results',
                      params: {
                        id: this.currgd.id,
                        cmd: 'result',
                        success: true,
                        data:
                          'Log in Successfull. You Will be Redirected Through a Secure Channel.',
                        redirectUrl: this.$route.params.nextUrl,
                      },
                    });
                  } else {
                    this.$router.push({
                      name: 'results',
                      params: {
                        id: this.currgd.id,
                        cmd: 'result',
                        success: true,
                        tocmd: 'home',
                        data:
                          'Log in Successfull. You Will be Redirected Through a Secure Channel.',
                        redirectUrl: '/',
                      },
                    });
                  }
                }, 500);
              }
            } else {
              this.$notify({
                title: 'Failed',
                message: 'Authentication Failed',
                type: 'error',
              });
              this.metatitle = 'Failed...';
              this.errormessageVisibility = true;
              this.successmessageVisibility = false;
              this.loading = false;
              this.resultmessage = response.data.message;
            }
          });
      }
    },
    checkParams() {
      if (this.$route.params.email) {
        this.email = this.$route.params.email;
        this.emailFocus = false;
        this.passwordFocus = true;
      } else {
        this.emailFocus = true;
        this.passwordFocus = false;
      }
    },
    gotoPage(url, cmd) {
      if (cmd) {
        this.$router.push({ path: `/${this.currgd.id}:${cmd}${url}` });
      } else {
        this.$router.push({ path: `/${this.currgd.id}:${url}` });
      }
    },
    validateData() {
      const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
      if (emailRegex.test(this.email) && this.password.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    handleForgotPass(e) {
      this.metatitle = 'Forgot Password';
      this.loading = true;
      e.preventDefault();
      if (this.forgotEmail.length > 0) {
        this.$backend
          .post(apiRoutes.forgotPass, {
            email: this.forgotEmail,
          })
          .then((response) => {
            if (
              response.data.auth &&
              response.data.registered &&
              response.data.changed
            ) {
              this.loading = false;
              this.forgotSuccessMessage = true;
              this.forgotErrorMessage = false;
              this.$notify({
                title: 'Success',
                message: 'Password Reset Success',
                type: 'success',
              });
              this.metatitle = 'Password Reset Success';
              this.forgotMessage = response.data.message;
            } else {
              this.loading = false;
              this.$notify({
                title: 'Failed',
                message: 'Password Reset Failed',
                type: 'error',
              });
              this.forgotSuccessMessage = false;
              this.forgotErrorMessage = true;
              this.metatitle = 'Password Reset Failed';
              this.forgotMessage = response.data.message;
            }
          });
      } else {
        this.loading = false;
        this.forgotSuccessMessage = false;
        this.forgotErrorMessage = true;
        this.forgotMessage = 'Please Type in Your Email First.';
      }
    },
  },
};
</script>
