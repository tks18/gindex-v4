/* eslint-disable no-param-reassign */

import { decodeSecret, getItem } from '@utils/encryptUtils';

export function scrollTo(element, scrollPixels, duration) {
  const scrollPos = element.scrollLeft;
  if (
    !(
      (scrollPos === 0 || scrollPixels > 0) &&
      (element.clientWidth + scrollPos === element.scrollWidth ||
        scrollPixels < 0)
    )
  ) {
    const startTime =
      'now' in window.performance ? performance.now() : new Date().getTime();

    const scroll = (timestamp) => {
      const timeElapsed = timestamp - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      element.scrollLeft = scrollPos + scrollPixels * progress;
      if (timeElapsed < duration) {
        window.requestAnimationFrame(scroll);
      }
    };
    window.requestAnimationFrame(scroll);
  }
}

export function shuffle(array) {
  const currentArray = array;
  let currentIndex = currentArray.length;
  let temporaryValue;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = currentArray[currentIndex];
    currentArray[currentIndex] = currentArray[randomIndex];
    currentArray[randomIndex] = temporaryValue;
  }
  return currentArray;
}

export function initializeUser() {
  const token = getItem('tokendata');
  const user = getItem('userdata');
  const session = getItem('sessiondata');
  if (user != null && token != null && session != null) {
    const tokenData = JSON.parse(decodeSecret(token));
    const userData = JSON.parse(decodeSecret(user));
    const sessionData = JSON.parse(decodeSecret(session));
    if (userData.admin && userData.superadmin) {
      return {
        isThere: true,
        type: 'normal',
        data: {
          user: userData,
          token: tokenData,
          session: sessionData,
          logged: true,
          loading: false,
          admin: true,
          superadmin: true,
        },
      };
    }
    if (userData.admin && !userData.superadmin) {
      return {
        isThere: true,
        type: 'normal',
        data: {
          user: userData,
          token: tokenData,
          session: sessionData,
          logged: true,
          loading: false,
          admin: true,
          superadmin: false,
        },
      };
    }
    return {
      isThere: true,
      type: 'normal',
      data: {
        user: userData,
        token: tokenData,
        session: sessionData,
        logged: true,
        loading: false,
        admin: false,
        superadmin: false,
      },
    };
  }
  return {
    isThere: false,
    type: 'normal',
    data: {
      user: null,
      token: null,
      logged: false,
      loading: false,
      admin: false,
      superadmin: false,
    },
  };
}

export function getgds(id) {
  if (window.gds) {
    const gds = window.gds.map((item, index) => ({
      name: item,
      id: index,
    }));
    if (gds) {
      return {
        gds,
        current: gds[id],
      };
    }
  }
  return {
    gds: [],
    current: null,
  };
}

export const icon = {
  'application/vnd.google-apps.folder': 'icon-morenwenjianjia',
  'video/mp4': 'icon-mp',
  'audio/mpeg': 'icon-mkv',
  'audio/ogg': 'icon-mkv',
  'audio/aac': 'icon-mkv',
  'audio/vnd.wav': 'icon-mkv',
  'video/x-matroska': 'icon-mkv',
  'video/x-msvideo': 'icon-avi',
  'video/webm': 'icon-webm',
  'text/plain': 'icon-txt',
  'text/markdown': 'icon-markdown',
  'text/x-ssa': 'icon-ASS',
  'text/html': 'icon-html',
  'text/x-python-script': 'icon-python',
  'text/x-java': 'icon-java1',
  'text/x-sh': 'icon-SH',
  'application/x-subrip': 'icon-srt',
  'application/zip': 'icon-zip',
  'application/x-zip-compressed': 'icon-zip',
  'application/rar': 'icon-rar',
  'application/pdf': 'icon-pdf',
  'application/json': 'icon-JSON1',
  'application/x-yaml': 'icon-YML',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'icon-word',
  'image/bmp': 'icon-img',
  'image/jpeg': 'icon-img',
  'image/png': 'icon-img',
  'image/gif': 'icon-img',
};
