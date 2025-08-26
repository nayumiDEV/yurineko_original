const LN_HOST = "https://ln.yurineko.moe";

export function linkParser(type = "manga", param) {
  switch (type) {
    case "lightnovel":
      return lightnovelLink(param)
    default:
      return mangaLink(param)
  }
}

export function readLinkParser(type = "manga", { mangaID, chapterID }) {
  switch (type) {
    case "lightnovel":
      return lightnovelReadLink(chapterID)
    default:
      return mangaReadLink({ mangaID, chapterID })
  }
}

export function mangaLink(param) {
  return `/manga/${param}`
}
export function lightnovelLink(param) {
  return `${LN_HOST}/novel/${param}`
}
export function tagLink(param) {
  return `/tag/${param}`
}
export function authorLink(param) {
  return `/author/${param}`
}
export function coupleLink(param) {
  return `/couple/${param}`
}
export function teamLink(param) {
  return `/team/${param}`
}
export function userLink(param) {
  return `/profile/${param}`
}
export function mangaReadLink({ mangaID, chapterID }) {
  return `/read/${mangaID}/${chapterID}`
}

export function lightnovelReadLink(chapterID) {
  return `${LN_HOST}/read/${chapterID}`
}
export function originLink(param) {
  return `/origin/${param}`
}
