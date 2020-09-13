export default function(){
  if(process.env.NODE_ENV == "production"){
    if(process.env.VUE_APP_THEME == "kournikova"){
      import("@/assets/style/theme/kournikova/register.scss");
    }
    if(process.env.VUE_APP_THEME == "shamrock"){
      import("@/assets/style/theme/shamrock/register.scss");
    }
    if(process.env.VUE_APP_THEME == "carnation"){
      import("@/assets/style/theme/carnation/register.scss");
    }
    if(process.env.VUE_APP_THEME == "purple-mountains-majesty"){
      import("@/assets/style/theme/purple-mountains-majesty/register.scss");
    }
    if(process.env.VUE_APP_THEME == "persian-rose"){
      import("@/assets/style/theme/persian-rose/register.scss");
    }
    if(process.env.VUE_APP_THEME == "selective-yellow"){
      import("@/assets/style/theme/selective-yellow/register.scss");
    }
    if(process.env.VUE_APP_THEME == "netflix-red"){
      import("@/assets/style/theme/netflix-red/register.scss");
    }
    if(process.env.VUE_APP_THEME == "purple-heart"){
      import("@/assets/style/theme/purple-heart/register.scss");
    }
    if(process.env.VUE_APP_THEME == "mona-lisa"){
      import("@/assets/style/theme/mona-lisa/register.scss");
    }
    if(process.env.VUE_APP_THEME == "emerald"){
      import("@/assets/style/theme/emerald/register.scss");
    }
    if(process.env.VUE_APP_THEME == "ice-cold"){
      import("@/assets/style/theme/ice-cold/register.scss");
    }
    if(process.env.VUE_APP_THEME == "curious-blue"){
      import("@/assets/style/theme/curious-blue/register.scss");
    }
    if(process.env.VUE_APP_THEME == "witch-haze"){
      import("@/assets/style/theme/witch-haze/register.scss");
    }
    if(process.env.VUE_APP_THEME == "salmon"){
      import("@/assets/style/theme/salmon/register.scss");
    }
    if(process.env.VUE_APP_THEME == "konifer"){
      import("@/assets/style/theme/konifer/register.scss");
    }
  } else {
    import("@/assets/style/theme/witch-haze/register.scss");
  }
}
