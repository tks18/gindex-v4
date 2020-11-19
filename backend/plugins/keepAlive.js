// Keep Site Online By Pinging every 25 Minutes.
const site = process.env.SITE;
const axios = require('axios');

function keepalive() {
  if (site) {
    try {
      setInterval(async () => {
        const data = await axios.get(site);
        console.log(data.config.url, "status:"+''+ data.status , "Text:"+' '+data.statusText);
      }, 1560000);
    } catch(e) {
      console.log(e);
    }
  } else {
    console.warn("Set site env var");
  }
}

module.exports = keepalive;
