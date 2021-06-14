<template>
  <div :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Trending Posts</h1>
    <div class="loading">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns is-desktop is-multiline is-centered is-vcentered">
      <div class="column is-two-thirds">
        <div class="columns is-multiline is-centered is-vcentered">
          <div class="column is-two-thirds">
            <div class="field">
              <div class="control px-2">
                <div class="select is-fullwidth">
                  <select v-model="drive" id="drive">
                    <option v-for="(disk, index) in gds" :value="index" v-bind:key="index">{{ disk.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="columns has-text-centered is-one-third">
            <div class="columns is-multiline is-centered is-vcentered">
              <div class="column is-half">
                <button class="button is-netflix-red is-rounded" @click="getPosts">
                  Get Posts
                </button>
              </div>
              <div class="column is-half">
                <button class="button is-netflix-red is-rounded" @click="addModal = true">
                  Add Posts
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="posts.length == 0" class="has-text-centered">
          <p class="subtitle has-text-white has-text-weight-bold">No Posts are there in Db or Select the Root & Click Get Posts to Refresh.</p>
        </div>
      </div>
      <div :class="addModal ? 'modal is-active' : 'modal'">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Add Posts</p>
            <button class="delete" @click="addModal = false" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns is-multiline is-centered is-vcentered">
              <div class="column is-one-third">
                <p class="subtitle has-text-weight-bold">Poster Link</p>
              </div>
              <div class="column is-two-thirds">
                <div class="control">
                  <input class="input is-rounded" id="add-trend-poster" placeholder="Poster Link Here" type="text" v-model="addData.poster">
                </div>
              </div>
              <div class="column is-one-third">
                <p class="subtitle has-text-weight-bold">Title</p>
              </div>
              <div class="column is-two-thirds">
                <div class="control">
                  <input class="input is-rounded" id="add-trend-title" placeholder="Display Title Here" type="text" v-model="addData.title">
                </div>
              </div>
              <div class="column is-one-third">
                <p class="subtitle has-text-weight-bold">Folder Link</p>
              </div>
              <div class="column is-two-thirds">
                <div class="control">
                  <input class="input is-rounded" id="add-trend-link" placeholder="Folder Link Here" type="text" v-model="addData.link">
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="addPost(addData)">Add</button>
          </footer>
        </div>
      </div>
      <div class="column is-two-thirds">
        <article :class=" errorMessage ? 'message is-danger' : 'message is-hidden is-danger'">
          <div class="message-header">
            <p>Error Proccessing</p>
            <button class="delete" @click="errorMessage = false" aria-label="delete"></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
        <article :class=" successMessage ? 'message is-success' : 'message is-hidden is-success'">
          <div class="message-header">
            <p>Success !</p>
            <button class="delete" @click="successMessage = false" aria-label="delete"></button>
          </div>
          <div class="message-body">
            {{ resultmessage }}
          </div>
        </article>
      </div>
      <div v-if="posts.length > 0" class="column is-full has-text-centered">
        <p class="subtitle has-text-white has-text-weight-bold">Currently Following Posts are there in your DB.</p>
      </div>
      <div v-if="posts.length > 0 && !ismobile" class="column is-four-fifths has-text-white has-text-centered">
        <div class="columns is-multiline is-centered is-vcentered">
          <div class="column is-quarter">
            Poster
          </div>
          <div class="column is-quarter">
            Title
          </div>
          <div class="column is-quarter">
            Link
          </div>
          <div class="column is-quarter">
            Actions
          </div>
        </div>
      </div>
      <div v-bind:key="editKey" v-if="posts.length > 0" class="column is-four-fifths">
        <div v-for="(post, index) in posts" v-bind:key="index" class="columns is-multiline is-centered is-vcentered">
          <div class="column is-quarter">
            <div class="control">
              <input class="input is-rounded" :disabled="editAction[post._id]" :id="'post'+Math.random()+index" type="text" v-model="postData[post._id].poster">
            </div>
          </div>
          <div class="column is-quarter">
            <div class="control">
              <input class="input is-rounded" :disabled="editAction[post._id]" :id="'post'+Math.random()+index" type="text" v-model="postData[post._id].title">
            </div>
          </div>
          <div class="column is-quarter">
            <div class="control">
              <input class="input is-rounded" :disabled="editAction[post._id]" :id="'post'+Math.random()+index" type="text" v-model="postData[post._id].link">
            </div>
          </div>
          <div class="column has-text-centered is-quarter">
            <span v-if="!editAction[post._id]" class="icon has-text-netflix pr-5" @click="editPosts(post._id, postData[post._id])">
              <i class="fas fa-check-double"></i>
            </span>
            <span class="icon has-text-netflix pr-5 pl-5" @click="changeEdit(post._id)">
              <i :class=" editAction[post._id] ? 'fas fa-edit' : 'fas fa-times' "></i>
            </span>
            <span class="icon has-text-netflix pl-5" @click="deletePost(post._id)">
              <i class="far fa-trash-alt"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  initializeUser,
  getgds,
} from "@utils/localUtils";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
export default {
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
  data: function(){
    return {
      metatitle: "Manage Categories",
      logged: false,
      addModal: false,
      user: {},
      successMessage: false,
      errorMessage: false,
      resultmessage: "",
      posts: [],
      originalRes: [],
      message: "",
      editAction: {},
      postData: {},
      addData: {
        title: "",
        poster: "",
        link: "",
      },
      editKey: 0,
      admin: false,
      superadmin: false,
      loading: false,
      fullpage: true,
      drive: "",
      gds: [],
      currgd: {},
    }
  },
  components: {
    Loading,
  },
  methods: {
    gotoPage(url, cmd) {
      if(cmd){
        this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
      } else {
        this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
      }
    },
    getPosts(){
      this.loading = true;
      if(Number.isInteger(this.drive)){
        this.$backend.post(apiRoutes.gettrendPosters, {
          email: this.user.email,
          root: this.drive
        }, backendHeaders(this.token.token)).then(response => {
          if(response.data.auth && response.data.registered){
            this.posts = response.data.posts;
            response.data.posts.forEach((post) => {
              return this.editAction[post._id] = true;
            });
            response.data.posts.forEach((post) => {
              return this.postData[post._id] = post;
            });
            this.editKey++;
            this.loading = false;
          } else {
            this.posts = [];
            this.editKey++;
            this.successMessage = false;
            this.errorMessage = true;
            this.resultmessage = response.data.message
            this.loading = false;
          }
        })
      } else {
        this.successMessage = false;
        this.errorMessage = true;
        this.resultmessage = "Please Select the Root First"
        this.loading = false;
      }
    },
    editPosts(postId, post){
      this.loading = true;
      this.$backend.post(apiRoutes.settrendPosters, {
        email: this.user.email,
        root: this.drive,
        postId: postId,
        post: post
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.changed){
          this.resultmessage = response.data.message;
          this.successMessage = true;
          this.errorMessage = false;
          this.getPosts();
          this.loading = false;
        } else {
          this.resultmessage = response.data.message;
          this.successMessage = false;
          this.errorMessage = true;
          this.getPosts();
          this.loading = false;
        }
      })
    },
    addPost(post){
      this.addModal = false;
      this.loading = true;
      if(Number.isInteger(this.drive)){
        post.root = this.drive;
        this.$backend.post(apiRoutes.settrendPosters, {
          email: this.user.email,
          root: this.drive,
          post: post
        }, backendHeaders(this.token.token)).then(response => {
          if(response.data.auth && response.data.registered && response.data.changed){
            this.resultmessage = response.data.message;
            this.successMessage = true;
            this.errorMessage = false;
            this.addData = {};
            this.getPosts();
            this.loading = false;
          } else {
            this.resultmessage = response.data.message;
            this.successMessage = false;
            this.errorMessage = true;
            this.getPosts();
            this.loading = false;
          }
        })
      } else {
        this.successMessage = false;
        this.errorMessage = true;
        this.resultmessage = "Please Select the Root First and Add"
        this.loading = false;
      }
    },
    deletePost(postId){
      this.loading = true;
      this.$backend.post(apiRoutes.deletetrendPosters, {
        root: this.drive,
        email: this.user.email,
        postId: postId
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered){
          this.successMessage = true;
          this.errorMessage = false;
          this.resultmessage = response.data.message;
          this.getPosts();
          this.loading = false;
        } else {
          this.successMessage = false;
          this.errorMessage = true;
          this.resultmessage = response.data.message;
          this.getPosts();
          this.loading = false;
        }
      })
    },
    changeEdit(postId){
      if(this.editAction[postId]){
        this.editAction[postId] = false;
      } else {
        this.editAction[postId] = true;
      }
      this.editKey++;
    },
  },
  computed: {
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
    },
  },
  beforeMount() {
    this.loading = true;
    var userData = initializeUser();
    if(userData.isThere){
      if(userData.type == "hybrid"){
        this.user = userData.data.user;
        this.logged = userData.data.logged;
        this.loading = userData.data.loading;
      } else if(userData.type == "normal"){
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
  created() {
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
}
</script>
