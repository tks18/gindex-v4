export default function cdnpath(path) {
  const cdn = process.env.VUE_APP_CDN_PATH;
  if (process.env.NODE_ENV === 'production') {
    return cdn + path;
  }
  return path;
}
