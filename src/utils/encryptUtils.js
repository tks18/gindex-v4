import crypto from 'crypto-js';
import bcrypt from 'bcryptjs';

const secret = process.env.VUE_APP_SECRET_PASS;

export function encodeSecret(object) {
  let hash = crypto.AES.encrypt(object, secret).toString();
  return hash;
}

export function decodeSecret(hash) {
  let object = crypto.AES.decrypt(hash, secret).toString(crypto.enc.Utf8);
  return object;
}

export function getItem(name) {
  let object = localStorage.getItem(name);
  return object;
}

export function setItem(name, obj) {
  localStorage.setItem(name, obj);
}

export function removeItem(name) {
  localStorage.removeItem(name);
}

export async function checkPass(pass, comparePass) {
  var synced = await bcrypt.compareSync(pass, comparePass);
  return synced;
}
