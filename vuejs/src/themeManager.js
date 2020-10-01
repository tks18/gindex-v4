export default function(){
  if(process.env.NODE_ENV == "production"){
    if(process.env.VUE_APP_THEME == "gradient-kournikova"){
      import("@/assets/style/theme/gradient-kournikova/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-shamrock"){
      import("@/assets/style/theme/gradient-shamrock/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-carnation"){
      import("@/assets/style/theme/gradient-carnation/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-purple-mountains-majesty"){
      import("@/assets/style/theme/gradient-purple-mountains-majesty/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-persian-rose"){
      import("@/assets/style/theme/gradient-persian-rose/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-selective-yellow"){
      import("@/assets/style/theme/gradient-selective-yellow/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-netflix-red"){
      import("@/assets/style/theme/gradient-netflix-red/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-purple-heart"){
      import("@/assets/style/theme/gradient-purple-heart/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-mona-lisa"){
      import("@/assets/style/theme/gradient-mona-lisa/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-emerald"){
      import("@/assets/style/theme/gradient-emerald/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-ice-cold"){
      import("@/assets/style/theme/gradient-ice-cold/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-curious-blue"){
      import("@/assets/style/theme/gradient-curious-blue/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-witch-haze"){
      import("@/assets/style/theme/gradient-witch-haze/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-salmon"){
      import("@/assets/style/theme/gradient-salmon/register.scss");
    }
    if(process.env.VUE_APP_THEME == "gradient-konifer"){
      import("@/assets/style/theme/gradient-konifer/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-kournikova"){
      import("@/assets/style/theme/black-kournikova/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-shamrock"){
      import("@/assets/style/theme/black-shamrock/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-carnation"){
      import("@/assets/style/theme/black-carnation/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-purple-mountains-majesty"){
      import("@/assets/style/theme/black-purple-mountains-majesty/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-persian-rose"){
      import("@/assets/style/theme/black-persian-rose/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-selective-yellow"){
      import("@/assets/style/theme/black-selective-yellow/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-netflix-red"){
      import("@/assets/style/theme/black-netflix-red/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-purple-heart"){
      import("@/assets/style/theme/black-purple-heart/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-mona-lisa"){
      import("@/assets/style/theme/black-mona-lisa/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-emerald"){
      import("@/assets/style/theme/black-emerald/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-ice-cold"){
      import("@/assets/style/theme/black-ice-cold/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-curious-blue"){
      import("@/assets/style/theme/black-curious-blue/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-witch-haze"){
      import("@/assets/style/theme/black-witch-haze/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-salmon"){
      import("@/assets/style/theme/black-salmon/register.scss");
    }
    if(process.env.VUE_APP_THEME == "black-konifer"){
      import("@/assets/style/theme/black-konifer/register.scss");
    }
  } else {
    if(process.env.VUE_APP_THEME){
      if(process.env.VUE_APP_THEME == "gradient-kournikova"){
        import("@/assets/style/theme/gradient-kournikova/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-shamrock"){
        import("@/assets/style/theme/gradient-shamrock/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-carnation"){
        import("@/assets/style/theme/gradient-carnation/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-purple-mountains-majesty"){
        import("@/assets/style/theme/gradient-purple-mountains-majesty/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-persian-rose"){
        import("@/assets/style/theme/gradient-persian-rose/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-selective-yellow"){
        import("@/assets/style/theme/gradient-selective-yellow/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-netflix-red"){
        import("@/assets/style/theme/gradient-netflix-red/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-purple-heart"){
        import("@/assets/style/theme/gradient-purple-heart/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-mona-lisa"){
        import("@/assets/style/theme/gradient-mona-lisa/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-emerald"){
        import("@/assets/style/theme/gradient-emerald/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-ice-cold"){
        import("@/assets/style/theme/gradient-ice-cold/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-curious-blue"){
        import("@/assets/style/theme/gradient-curious-blue/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-witch-haze"){
        import("@/assets/style/theme/gradient-witch-haze/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-salmon"){
        import("@/assets/style/theme/gradient-salmon/register.scss");
      }
      if(process.env.VUE_APP_THEME == "gradient-konifer"){
        import("@/assets/style/theme/gradient-konifer/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-kournikova"){
        import("@/assets/style/theme/black-kournikova/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-shamrock"){
        import("@/assets/style/theme/black-shamrock/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-carnation"){
        import("@/assets/style/theme/black-carnation/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-purple-mountains-majesty"){
        import("@/assets/style/theme/black-purple-mountains-majesty/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-persian-rose"){
        import("@/assets/style/theme/black-persian-rose/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-selective-yellow"){
        import("@/assets/style/theme/black-selective-yellow/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-netflix-red"){
        import("@/assets/style/theme/black-netflix-red/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-purple-heart"){
        import("@/assets/style/theme/black-purple-heart/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-mona-lisa"){
        import("@/assets/style/theme/black-mona-lisa/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-emerald"){
        import("@/assets/style/theme/black-emerald/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-ice-cold"){
        import("@/assets/style/theme/black-ice-cold/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-curious-blue"){
        import("@/assets/style/theme/black-curious-blue/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-witch-haze"){
        import("@/assets/style/theme/black-witch-haze/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-salmon"){
        import("@/assets/style/theme/black-salmon/register.scss");
      }
      if(process.env.VUE_APP_THEME == "black-konifer"){
        import("@/assets/style/theme/black-konifer/register.scss");
      }
    } else {
      import("@/assets/style/theme/black-emerald/register.scss");
    }
  }
}
