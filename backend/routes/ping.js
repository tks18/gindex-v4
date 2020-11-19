const express = require("express");
const router = express.Router();
var ping = require('ping');

router.post('/', async function(req, res){
  let pinged = await ping.promise.probe(req.body.pingsite, {
         timeout: 10,
     });
  res.send(pinged);
})

module.exports = router;
