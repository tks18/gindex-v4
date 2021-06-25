module.exports = function (origin){
  var allowedOrigins = process.env.FRONTENDURL.split(",");
  if (origin && allowedOrigins.indexOf(origin) > -1){
    return true
  } else {
    return false
  }
}
