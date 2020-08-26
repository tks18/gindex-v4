import { decodeSecret, getItem, removeItem } from '@utils/encryptUtils';

export function scrollTo(element, scrollPixels, duration) {
  const scrollPos = element.scrollLeft;
  if ( !( (scrollPos === 0 || scrollPixels > 0) && (element.clientWidth + scrollPos === element.scrollWidth || scrollPixels < 0)))
  {
    const startTime =
      "now" in window.performance
        ? performance.now()
        : new Date().getTime();

    const scroll = (timestamp) => {
      const timeElapsed = timestamp - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      element.scrollLeft = scrollPos + scrollPixels * progress;
      if (timeElapsed < duration) {
        window.requestAnimationFrame(scroll);
      } else {
        return;
      }
    }
    window.requestAnimationFrame(scroll);
  }
}

export function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array
}

export function initializeUser() {
  var token = getItem("tokendata");
  var user = getItem("userdata");
  var hyBridToken = getItem("hybridToken");
  if(hyBridToken && hyBridToken != null || hyBridToken != undefined){
    const hybridData = JSON.parse(decodeSecret(hyBridToken));
    if(hybridData.user){
      return {
        isThere: true,
        type: "hybrid",
        data: {
          user: hybridData,
          token: null,
          logged: true,
          loading: false,
          admin: false,
          superadmin: false,
        },
      }
    } else {
      removeItem("hybridToken");
      return {
        isThere: false,
        type: "hybrid",
        data: {
          user: null,
          token: null,
          logged: false,
          loading: false,
          admin: false,
          superadmin: false,
        },
      }
    }
  } else if (user != null && token != null){
    var tokenData = JSON.parse(decodeSecret(token));
    var userData = JSON.parse(decodeSecret(user));
    if(userData.admin && userData.superadmin){
      return {
        isThere: true,
        type: "normal",
        data: {
          user: userData,
          token: tokenData,
          logged: true,
          loading: false,
          admin: true,
          superadmin: true,
        },
      }
    } else if(userData.admin && !userData.superadmin){
      return {
        isThere: true,
        type: "normal",
        data: {
          user: userData,
          token: tokenData,
          logged: true,
          loading: false,
          admin: true,
          superadmin: false,
        },
      }
    } else {
      return {
        isThere: true,
        type: "normal",
        data: {
          user: userData,
          token: tokenData,
          logged: true,
          loading: false,
          admin: false,
          superadmin: false,
        },
      }
    }
  } else {
    return {
      isThere: false,
      type: "normal",
      data: {
        user: null,
        token: null,
        logged: false,
        loading: false,
        admin: false,
        superadmin: false,
      },
    }
  }
}

export function getgds(id) {
  if (window.gds) {
    let gds = window.gds.map((item, index) => {
      return {
        name: item,
        id: index,
      };
    });
    if (gds) {
      return {
        gds: gds,
        current: gds[id]
      }
    }
  }
}

export const icon = {
  "application/vnd.google-apps.folder": "icon-morenwenjianjia",
  "video/mp4": "icon-mp",
  "audio/mpeg": "icon-mkv",
  "audio/ogg": "icon-mkv",
  "audio/aac": "icon-mkv",
  "audio/vnd.wav": "icon-mkv",
  "video/x-matroska": "icon-mkv",
  "video/x-msvideo": "icon-avi",
  "video/webm": "icon-webm",
  "text/plain": "icon-txt",
  "text/markdown": "icon-markdown",
  "text/x-ssa": "icon-ASS",
  "text/html": "icon-html",
  "text/x-python-script": "icon-python",
  "text/x-java": "icon-java1",
  "text/x-sh": "icon-SH",
  "application/x-subrip": "icon-srt",
  "application/zip": "icon-zip",
  "application/x-zip-compressed": "icon-zip",
  "application/rar": "icon-rar",
  "application/pdf": "icon-pdf",
  "application/json": "icon-JSON1",
  "application/x-yaml": "icon-YML",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "icon-word",
  "image/bmp": "icon-img",
  "image/jpeg": "icon-img",
  "image/png": "icon-img",
  "image/gif": "icon-img"
};
