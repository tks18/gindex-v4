<template>
    <div class="conten mx-2 mt-2">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-vcentered is-centered is-multiline">
        <div class="column is centered has-text-centered has-text-white is-two-fifths">
          <article :class=" errormessageVisibility ? 'message is-danger' : 'message is-hidden is-danger'">
            <div class="message-header">
              <p>Error Requesting !!</p>
              <button class="delete" @click="errormessageVisibility = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <article :class=" successmessageVisibility ? 'message is-success' : 'message is-hidden is-success'">
            <div class="message-header">
              <p>Success !</p>
              <button class="delete" @click="successmessageVisibility = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <h2 class="title has-text-weight-bold has-text-white">Request Access</h2>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-focused" placeholder="Email" id="email" type="email" v-model="email" required autofocus>
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
                <input class="input is-rounded" placeholder="Your Name" id="name" type="text" v-model="name" required autofocus>
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <label class="label has-text-white">Select the Space for Which Access is Required ?</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="drive" id="drive">
                    <option v-for="(disk, index) in gds" :value="index" v-bind:key="index">{{ disk.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <textarea class="textarea is-success is-rounded" placeholder="Why You Need Access ?" id="message" rows="3" v-model="message" required></textarea>
                <p class="help is-success">How did You Know about this and Why do You need?</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="terms" name="terms" v-model="checked">
                  <label for="terms">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="code" name="terms" v-model="codechecked">
                  <label for="code">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a></span>
                  </label>
                </div>
              </div>
            </div>
            <button :class=" loading ? 'button is-loading is-rounded is-netflix-red is-medium' : 'button is-netflix-red is-rounded is-medium' " type="submit" :disabled="disabled" >
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Request Access</span>
            </button>
          </form>
        </div>
        <div class="column is-half">
          <section class="hero is-black is-medium">
            <div class="hero-body">
              <div class="container">
                <div class="tile is-ancestor">
                  <div class="tile is-parent">
                    <article class="tile has-text-centered is-child notification is-warning">
                      <p class="title has-text-dark">
                        <span class="icon">
                          <i class="fab fa-superpowers"></i>
                        </span>
                        <span> Nicee</span>
                      </p>
                      <p class="subtitle has-text-dark">Request Content Access</p>
                      <div class="content">
                          <p class="has-text-dark has-text-weight-semibold">You have to Request Before Continuing in the Website.</p>
                          <p class="has-text-dark">When our Admins Accept your Request, You will Receive an Email Containing an OTP to Register your Account and Verify.</p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
</template>
<script>
import { apiRoutes } from "@/utils/backendUtils";
import { getgds } from "@utils/localUtils";
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
            if(titleChunk && this.siteName){
              return titleChunk ? `${titleChunk} | ${this.siteName}` : `${this.siteName}`;
            } else {
              return "Loading..."
            }
          },
        }
      },
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                metatitle: "Request Access",
                email : "",
                emailFocus: "",
                nameFocus: "",
                message: "",
                drive: 0,
                gds: [],
                currgd: {},
                resultmessage: "",
                databasemessage: "",
                checked: "",
                codechecked: "",
                loading: false,
                disabled: true,
                fullpage: true,
                successmessageVisibility: false,
                errormessageVisibility: false,

            }
        },
        methods : {
            handleSubmit(e) {
              this.metatitle = "Requesting Access..."
              this.loading = true;
                e.preventDefault()
                if(this.checked){
                  if(this.codechecked){
                    let url = apiRoutes.requestRoute
                    this.$backend.post(url, {
                          name: this.name,
                          email: this.email,
                          drives: this.drive,
                          message: this.message,
                    })
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered){
                            this.successmessageVisibility = true;
                            this.errormessageVisibility = false;
                            this.loading = false;
                            this.metatitle = "Success Requesting...";
                            this.resultmessage = response.data.message
                          } else {
                            this.successmessageVisibility = false;
                            this.errormessageVisibility = true;
                            this.loading = false;
                            this.metatitle = "Request Failed...";
                            this.resultmessage = response.data.message
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                  } else {
                    this.successmessageVisibility = false;
                    this.errormessageVisibility = true;
                    this.loading = false;
                    this.metatitle = "Request Failed...";
                    this.resultmessage = "> You Need to Accept Code of Conduct."
                    this.checked = false;
                  }
                } else {
                  this.successmessageVisibility = false;
                  this.errormessageVisibility = true;
                  this.loading = false;
                  this.metatitle = "Request Failed...";
                  this.resultmessage = "> You Need to Accept Community Guidelines."
                  this.checked = false;
                }
            },
            checkParams() {
              if(this.$route.params.email){
                this.email = this.$route.params.email
                this.emailFocus = false;
                this.nameFocus = true;
              } else {
                this.email = ""
                this.emailFocus = true;
                this.nameFocus = false;
              }
            },
            validateData(){
              const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
              if(emailRegex.test(this.email) && this.name.length > 0 && this.message.length > 0 && this.checked && this.codechecked){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            }
        },
        computed: {
          siteName() {
            return window.gds.filter((item, index) => {
              return index == this.$route.params.id;
            })[0];
          },
        },
        beforeMount(){
          this.loading = true;
          this.$backend.post(apiRoutes.getSiteSettings).then(response => {
            if(response.data.auth && response.data.registered){
              if(response.data.data.requests){
                this.loading = false;
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: {id: this.currgd.id, cmd: 'result', success: false, data: "User Requests are Closed by the Admin. Please Try Afterwards or Contact Admins.", noredirect: true} })
              }
            } else {
              this.loading = false;
            }
          })
        },
        mounted() {
          if(this.$audio.player() != undefined) this.$audio.destroy();
          this.checkParams();
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        },
        watch: {
          name: "validateData",
          email: "validateData",
          message: "validateData",
          checked: "validateData",
          codechecked: "validateData",
          drive: function() {
            console.log(this.drive);
          }
        },
    }
</script>
