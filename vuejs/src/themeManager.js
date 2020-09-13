export default function(){
  if(process.env.VUE_APP_THEME == "yellow"){
    import("@/assets/style/theme/yellow/register.scss");
  }
  if(process.env.VUE_APP_THEME == "teal"){
    import("@/assets/style/theme/teal/register.scss");
  }
  if(process.env.VUE_APP_THEME == "red"){
    import("@/assets/style/theme/red/register.scss");
  }
  if(process.env.VUE_APP_THEME == "purple"){
    import("@/assets/style/theme/purple/register.scss");
  }
  if(process.env.VUE_APP_THEME == "pink"){
    import("@/assets/style/theme/pink/register.scss");
  }
  if(process.env.VUE_APP_THEME == "orange"){
    import("@/assets/style/theme/orange/register.scss");
  }
  if(process.env.VUE_APP_THEME == "netflix-red"){
    import("@/assets/style/theme/netflix-red/register.scss");
  }
  if(process.env.VUE_APP_THEME == "lime"){
    import("@/assets/style/theme/lime/register.scss");
  }
  if(process.env.VUE_APP_THEME == "indigo"){
    import("@/assets/style/theme/indigo/register.scss");
  }
  if(process.env.VUE_APP_THEME == "green"){
    import("@/assets/style/theme/green/register.scss");
  }
  if(process.env.VUE_APP_THEME == "deep-orange"){
    import("@/assets/style/theme/deep-orange/register.scss");
  }
  if(process.env.VUE_APP_THEME == "blue"){
    import("@/assets/style/theme/blue/register.scss");
  }
}
