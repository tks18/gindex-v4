const jwt = require("jsonwebtoken");

function verify(token){
  if(token){
    return jwt.verify(token, process.env.TOKENSECRET, function(error, decoded){
      if(decoded){
        return true
      } else {
        return false
      }
    });
  } else {
    return false
  }
}

module.exports = verify
