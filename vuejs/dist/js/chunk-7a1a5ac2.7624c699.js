(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7a1a5ac2"],{"2e84":function(e,s,t){"use strict";t.r(s);var a=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{class:e.ismobile?"content mx-1 mt-2 px-0 is-clipped":"content ml-5 mt-2 mr-5 pl-5 pr-5 is-clipped"},[t("div",{staticClass:"loading"},[t("loading",{attrs:{active:e.loading,"can-cancel":!1,"is-full-page":e.fullpage},on:{"update:active":function(s){e.loading=s}}})],1),t("div",{staticClass:"columns is-vcentered is-centered is-multiline"},[t("div",{staticClass:"column is-half has-text-centered has-text-white"},[t("div",{class:e.adminmodal?"modal is-active":"modal"},[t("div",{staticClass:"modal-background"}),t("div",{staticClass:"modal-card"},[t("header",{staticClass:"modal-card-head"},[t("p",{staticClass:"modal-card-title has-text-centered"},[e._v("Admin Features")]),t("button",{staticClass:"delete",attrs:{"aria-label":"close"},on:{click:function(s){e.adminmodal=!1}}})]),e._m(0)])]),t("article",{class:e.errorMessage?"message is-danger":"message is-hidden is-danger"},[t("div",{staticClass:"message-header"},[t("p",[e._v("Error Logging in!!")]),t("button",{staticClass:"delete",attrs:{"aria-label":"delete"},on:{click:function(s){e.errorMessage=!1}}})]),t("div",{staticClass:"message-body"},[e._v(" "+e._s(e.resultmessage)+" ")])]),t("article",{class:e.successMessage?"message is-success":"message is-hidden is-success"},[t("div",{staticClass:"message-header"},[t("p",[e._v("Success !")]),t("button",{staticClass:"delete",attrs:{"aria-label":"delete"},on:{click:function(s){e.successMessage=!1}}})]),t("div",{staticClass:"message-body"},[e._v(" "+e._s(e.resultmessage)+" ")])]),t("h2",{staticClass:"title has-text-weight-bold has-text-white"},[e._v("Request Access")]),t("form",{on:{submit:function(s){return s.preventDefault(),e.handleSubmit(s)}}},[t("div",{staticClass:"control mb-3"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.role,expression:"role"}],staticClass:"is-checkradio is-small is-warning",attrs:{id:"adminradio",type:"radio",name:"role",value:"admin",disabled:""},domProps:{checked:e._q(e.role,"admin")},on:{change:function(s){e.role="admin"}}}),t("label",{attrs:{for:"adminradio"}},[e._v(" Admin")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.role,expression:"role"}],staticClass:"is-checkradio is-small is-warning",attrs:{id:"superadminradio",type:"radio",name:"role",value:"superadmin",disabled:""},domProps:{checked:e._q(e.role,"superadmin")},on:{change:function(s){e.role="superadmin"}}}),t("label",{attrs:{for:"superadminradio"}},[e._v("Superadmin")])]),t("div",{staticClass:"field"},[t("div",{staticClass:"control"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.message,expression:"message"}],staticClass:"textarea is-success is-rounded",attrs:{placeholder:"Why You Need More Previleges ?",id:"message",rows:"3",required:""},domProps:{value:e.message},on:{input:function(s){s.target.composing||(e.message=s.target.value)}}})])]),t("div",{staticClass:"field"},[t("div",{staticClass:"control"},[t("div",{staticClass:"b-checkbox is-success is-circular is-inline"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.checked,expression:"checked"}],staticClass:"styled has-text-success",attrs:{type:"checkbox",id:"terms",name:"terms"},domProps:{checked:Array.isArray(e.checked)?e._i(e.checked,null)>-1:e.checked},on:{change:function(s){var t=e.checked,a=s.target,i=!!a.checked;if(Array.isArray(t)){var l=null,c=e._i(t,l);a.checked?c<0&&(e.checked=t.concat([l])):c>-1&&(e.checked=t.slice(0,c).concat(t.slice(c+1)))}else e.checked=i}}}),e._m(1)])])]),t("div",{staticClass:"field"},[t("div",{staticClass:"control"},[t("div",{staticClass:"b-checkbox is-success is-circular is-inline"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.codechecked,expression:"codechecked"}],staticClass:"styled has-text-success",attrs:{type:"checkbox",id:"code",name:"terms"},domProps:{checked:Array.isArray(e.codechecked)?e._i(e.codechecked,null)>-1:e.codechecked},on:{change:function(s){var t=e.codechecked,a=s.target,i=!!a.checked;if(Array.isArray(t)){var l=null,c=e._i(t,l);a.checked?c<0&&(e.codechecked=t.concat([l])):c>-1&&(e.codechecked=t.slice(0,c).concat(t.slice(c+1)))}else e.codechecked=i}}}),e._m(2)])])]),t("button",{class:e.loading?"button is-loading is-rounded is-warning is-medium":"button is-warning is-rounded is-medium",attrs:{type:"submit",disabled:e.disabled}},[e._m(3),t("span",[e._v("Request Access")])])])]),t("div",{staticClass:"column is-half"},[t("div",{staticClass:"columns is-multiline is-desktop is-centered"},[t("div",{staticClass:"column is-full"},[e._m(4),t("div",{class:e.superadminmodal?"modal is-active":"modal"},[t("div",{staticClass:"modal-background"}),t("div",{staticClass:"modal-card"},[t("header",{staticClass:"modal-card-head"},[t("p",{staticClass:"modal-card-title has-text-centered"},[e._v("Super Admin Features")]),t("button",{staticClass:"delete",attrs:{"aria-label":"close"},on:{click:function(s){e.superadminmodal=!1}}})]),e._m(5)])]),t("div",{staticClass:"box has-background-danger"},[t("h2",{staticClass:"title has-text-white has-text-centered has-text-weight-bold"},[e._v("What Previleges You Get?")]),t("p",{staticClass:"subtitle has-text-weight-bold has-text-centered"},[e._v(" Click the Below Buttons to See the Features")]),t("div",{staticClass:"columns is-multiline is-mobile is-centered"},[e.admin||e.superadmin?e._e():t("div",{staticClass:"column is-two-thirds"},[t("p",{staticClass:"subtitle has-text-white"},[e._v("For Admin Features")])]),e.admin||e.superadmin?e._e():t("div",{staticClass:"column is-one-third"},[t("button",{staticClass:"button is-white is-rounded",on:{click:function(s){e.adminmodal=!0}}},[e._m(6),t("span",{staticClass:"content"},[e._v("Click Here")])])]),e.admin&&!e.superadmin?t("div",{staticClass:"column is-two-thirds"},[t("p",{staticClass:"subtitle has-text-white"},[e._v("For Superadmin Features")])]):e._e(),e.admin&&!e.superadmin?t("div",{staticClass:"column is-one-third"},[t("button",{staticClass:"button is-white is-rounded",on:{click:function(s){e.superadminmodal=!0}}},[e._m(7),t("span",{staticClass:"content"},[e._v("Click Here")])])]):e._e()])])])])])])])},i=[function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("section",{staticClass:"modal-card-body"},[t("div",{staticClass:"columns is-multiline is-desktop"},[t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-bold has-text-centered"},[e._v("Features")])]),t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-semibold"},[e._v("Permissions Related to New Users:")])]),t("div",{staticClass:"column is-full has-text-left"},[t("ul",[t("li",{staticClass:"has-text-black"},[e._v(" Accept New Users")]),t("li",{staticClass:"has-text-black"},[e._v(" Invite New Users through Glory to Heaven Mail Service.")])])]),t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-semibold"},[e._v("Permission Related to Existing Users:")])]),t("div",{staticClass:"column is-full has-text-left"},[t("ul",[t("li",{staticClass:"has-text-black"},[e._v(" Delete a User")]),t("li",{staticClass:"has-text-black"},[e._v(" Add a User to Spam")])])])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("label",{attrs:{for:"terms"}},[t("span",{staticClass:"content has-text-white"},[e._v(" I Accept and Read the "),t("a",{staticClass:"has-text-success",attrs:{href:"https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md",target:"_blank"}},[e._v("Community Guidelines")])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("label",{attrs:{for:"code"}},[t("span",{staticClass:"content has-text-white"},[e._v(" I Accept and Read the "),t("a",{staticClass:"has-text-success",attrs:{href:"https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md",target:"_blank"}},[e._v("Code of Conduct")])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("span",{staticClass:"icon"},[t("i",{staticClass:"fas fa-user-plus"})])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"box has-background-warning"},[t("h2",{staticClass:"title has-text-black has-text-centered has-text-weight-bold"},[e._v("Request More Previleges")]),t("div",{staticClass:"content"},[t("span",{staticClass:"subtitle has-text-weight-bold has-text-centered"},[e._v("Ahh ! Why You need to Have More Access to this Website.")])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("section",{staticClass:"modal-card-body"},[t("div",{staticClass:"columns is-multiline is-desktop"},[t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-bold has-text-centered"},[e._v("Features")])]),t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-semibold has-text-centered"},[e._v("Permissions Related to New Users:")])]),t("div",{staticClass:"column is-full"},[t("ul",[t("li",{staticClass:"has-text-black"},[e._v(" Accept New Users")]),t("li",{staticClass:"has-text-black"},[e._v(" Invite New Users through Glory to Heaven Mail Service.")])])]),t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-semibold has-text-centered"},[e._v("Granting Permissions to Existing Users:")])]),t("div",{staticClass:"column is-full"},[t("ul",[t("li",[e._v(" Promote a User to Admin")]),t("li",[e._v(" Promote a Admin to Superadmin")]),t("li",[e._v(" Invite a Admin for Superadmin Role throught Glory to Heaven mail Service")]),t("li",[e._v(" Invite a user for Admin Role throught Glory to Heaven mail Service")])])]),t("div",{staticClass:"column is-full"},[t("p",{staticClass:"subtitle has-text-weight-semibold has-text-centered"},[e._v("Permission Related to Existing Users:")])]),t("div",{staticClass:"column is-full"},[t("ul",[t("li",[e._v(" Delete a User")]),t("li",[e._v(" Delete a Admin")]),t("li",[e._v(" Delete a Superadmin")]),t("li",[e._v(" Add a User to Spam")])])])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("span",{staticClass:"icon is-small"},[t("i",{staticClass:"fas fa-sticky-note"})])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("span",{staticClass:"icon is-small"},[t("i",{staticClass:"fas fa-sticky-note"})])}],l=(t("d81d"),t("b0c0"),t("d3b7"),t("25f0"),t("9062")),c=t.n(l),n=(t("e40d"),{components:{Loading:c.a},props:["nextUrl"],data:function(){return{user:{},admin:!1,superadmin:!1,resultmessage:"",checked:"",codechecked:"",disabled:"",gds:[],currgd:{},adminmodal:!1,superadminmodal:!1,errorMessage:!1,successMessage:!1,role:"",apiurl:"",loading:!1,fullpage:!0,message:""}},methods:{handleSubmit:function(e){var s=this;this.loading=!0,e.preventDefault(),this.checked&&this.codechecked?this.$http.post(this.apiurl,{name:this.user.name,email:this.user.email,message:this.message}).then((function(e){e&&(e.data.auth&&e.data.registered?(s.successMessage=!0,s.errorMessage=!1,s.loading=!1,s.resultmessage=e.data.message):(s.successMessage=!1,s.errorMessage=!0,s.loading=!1,s.resultmessage=e.data.message))})).catch((function(e){console.error(e)})):(this.successMessage=!1,this.errorMessage=!0,this.loading=!1,this.resultmessage="You Need to Accept Community Guidelines.")},validateData:function(){this.role.length>0&&this.checked&&this.codechecked&&this.message.length>0?this.disabled=!1:this.disabled=!0}},computed:{ismobile:function(){var e=window.innerWidth>0?window.innerWidth:screen.width;return!(e>966)}},beforeMount:function(){this.loading=!0;var e=localStorage.getItem("tokendata"),s=localStorage.getItem("userdata");if(null!=s&&null!=e){var t=JSON.parse(this.$hash.AES.decrypt(s,this.$pass).toString(this.$hash.enc.Utf8));this.user=t,this.loading=!1}else this.user=null,this.loading=!1},mounted:function(){this.loading=!0,this.user.admin||this.user.superadmin?this.user.admin&&!this.user.superadmin?(this.apiurl=window.apiRoutes.requestsuperadminroute,this.admin=!0,this.superadmin=!1,this.role="superadmin",this.loading=!1):this.loading=!1:(this.apiurl=window.apiRoutes.requestadminroute,this.admin=!1,this.superadmin=!1,this.role="admin",this.loading=!1)},created:function(){if(window.addEventListener("beforeunload",(function(){localStorage.removeItem("hybridToken")})),window.gds){this.gds=window.gds.map((function(e,s){return{name:e,id:s}}));var e=this.$route.params.id;this.gds&&(this.currgd=this.gds[e])}},watch:{role:"validateData",message:"validateData",checked:"validateData",codechecked:"validateData"}}),d=n,r=t("2877"),o=Object(r["a"])(d,a,i,!1,null,null,null);s["default"]=o.exports},e40d:function(e,s,t){}}]);