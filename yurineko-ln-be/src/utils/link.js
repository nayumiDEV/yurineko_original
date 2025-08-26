module.exports = (lnId, chapterId) => {
  if (chapterId != 0) {
    return `https://ln.yurineko.net/read/${chapterId}`
  } else {
    return `https://ln.yurineko.net/novel/${lnId}`
  }
}
