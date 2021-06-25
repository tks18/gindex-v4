/* eslint-disable no-nested-ternary */

import axios from '@/plugin/axios';

const { Base64 } = require('js-base64');

const text_exts = [
  'html',
  'php',
  'css',
  'go',
  'java',
  'js',
  'json',
  'txt',
  'sh',
  'md',
];
const audio_exts = ['mp3', 'flac', 'wav', 'ogg', 'm4a'];
const video_exts = ['mp4', 'webm', 'mkv', 'm3u8', 'avi', 'flv', 'mov', 'm4v'];
const image_exts = ['bmp', 'jpg', 'jpeg', 'png', 'gif'];
const pdf_exts = ['pdf'];

export const encodePath = (path) => {
  const encodedPath = path.replace(/(.*)/, (p1, p2) => {
    const replacedPath = p2
      .replace()
      .replace(/\//g, '%2F')
      .replace(/#/g, '%23');
    return replacedPath;
  });
  return encodedPath;
};

export const checkoutPath = (path, file) => {
  let encodedPath = encodePath(path);
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    if (encodedPath.substr(-1) !== '/') {
      encodedPath += '/';
    }
  }
  return encodedPath;
};

export const checkView = (path) => {
  const viewPath = path;
  const name = viewPath.split('/').pop();
  const ext = name.split('.').pop().toLowerCase();
  const base64Path = encode64(viewPath);
  let returnPath;
  if (text_exts.indexOf(`${ext}`) !== -1) {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}text/${base64Path}`,
    );
  } else if (pdf_exts.indexOf(`${ext}`) !== -1) {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}pdf/${base64Path}`,
    );
  } else if (audio_exts.indexOf(`${ext}`) !== -1) {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}audio/${base64Path}`,
    );
  } else if (video_exts.indexOf(`${ext}`) !== -1) {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}video/${base64Path}`,
    );
  } else if (image_exts.indexOf(`${ext}`) !== -1) {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}image/${base64Path}`,
    );
  } else {
    returnPath = viewPath.replace(
      /\/(\d+:)\/.*/,
      (p1, p2) => `/${p2}others/${base64Path}`,
    );
  }
  return returnPath;
};

export const checkExtends = (path) => {
  const name = path.split('/').pop();
  const ext = name.split('.').pop().toLowerCase();
  const exts = text_exts.concat(
    ...video_exts,
    ...image_exts,
    ...pdf_exts,
    ...audio_exts,
  );
  return exts.indexOf(`${ext}`) !== -1;
};

export const encode64 = (str) => Base64.encodeURI(str);

export const decode64 = (str) => Base64.decode(str);

export async function get_file(option, callback) {
  const { path } = option;
  const { modifiedTime } = option.file;
  const key = `file_path_${path}${modifiedTime}`;
  const data = localStorage.getItem(key);
  let fileData;
  if (data) {
    fileData = await callback(data);
  }
  fileData = await axios.get(path).then((res) => {
    const { data: newData } = res;
    localStorage.setItem(key, newData);
    return callback(newData);
  });
  return fileData;
}

export function get_filex(path, callback) {
  axios.get(path).then((res) => {
    const { data } = res;
    callback(data);
  });
}

// Time conversion
export function utc2beijing(utc_datetime) {
  // Convert to normal time format year-month-day hour:minute:second
  const T_pos = utc_datetime.indexOf('T');
  const Z_pos = utc_datetime.indexOf('Z');
  const year_month_day = utc_datetime.substr(0, T_pos);
  const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
  const new_datetime = `${year_month_day} ${hour_minute_second}`; // 2017-03-31 08:02:06

  // Processing becomes timestamp
  let timestamp = new Date(Date.parse(new_datetime));
  timestamp = timestamp.getTime();
  timestamp /= 1000;

  // Add 8 hours, Beijing time is eight more time zones than UTC time
  let unixtimestamp = timestamp + 5 * 60 * 60 + 30 * 60;

  // Timestamp converted to time
  unixtimestamp = new Date(unixtimestamp * 1000);
  const year = 1900 + unixtimestamp.getYear();
  const month = `0${unixtimestamp.getMonth() + 1}`;
  const date = `0${unixtimestamp.getDate()}`;
  const hour = `0${unixtimestamp.getHours()}`;
  const minute = `0${unixtimestamp.getMinutes()}`;
  const second = `0${unixtimestamp.getSeconds()}`;
  return `${year}-${month.substring(
    month.length - 2,
    month.length,
  )}-${date.substring(date.length - 2, date.length)} ${hour.substring(
    hour.length - 2,
    hour.length,
  )}:${minute.substring(minute.length - 2, minute.length)}:${second.substring(
    second.length - 2,
    second.length,
  )}`;
}

export function formatFileSize(bytes) {
  let formattedSize;
  if (bytes >= 1000000000) {
    formattedSize = `${(bytes / 1000000000).toFixed(2)} GB`;
  } else if (bytes >= 1000000) {
    formattedSize = `${(bytes / 1000000).toFixed(2)} MB`;
  } else if (bytes >= 1000) {
    formattedSize = `${(bytes / 1000).toFixed(2)} KB`;
  } else if (bytes > 1) {
    formattedSize += ' bytes';
  } else if (bytes === 1) {
    formattedSize += ' byte';
  } else {
    formattedSize = '';
  }
  return formattedSize;
}

export function formatDate(date, fmt) {
  let format = fmt || 'YYYY-MM-DD HH:mm:ss';
  let crctDate;
  if (typeof date === 'string') {
    // date = new Date(date.replace(/-/g, '/'))
    crctDate = new Date(date);
  }
  if (typeof date === 'number') {
    crctDate = new Date(date);
  }
  const o = {
    'M+': crctDate.getMonth() + 1,
    'D+': crctDate.getDate(),
    'h+': crctDate.getHours() % 12 === 0 ? 12 : crctDate.getHours() % 12,
    'H+': crctDate.getHours(),
    'm+': crctDate.getMinutes(),
    's+': crctDate.getSeconds(),
    'q+': Math.floor((crctDate.getMonth() + 3) / 3),
    S: crctDate.getMilliseconds(),
  };
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d',
  };
  if (/(Y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${crctDate.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }
  if (/(E+)/.test(format)) {
    format = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[`${crctDate.getDay()}`],
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  }
  return format;
}
