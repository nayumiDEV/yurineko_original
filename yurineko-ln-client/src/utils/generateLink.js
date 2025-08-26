export function lightnovelLink(param) {
  return `/novel/${param}`
}
export function mangaLink(param) {
  return `https://yurineko.moe/manga/${param}`
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
export function lightnovelReadLink({ mangaID, chapterID }) {
  return `/read/${chapterID}`
}
export function mangaReadLink({ mangaID, chapterID }) {
  return `https://yurineko.moe/read/${mangaID}/${chapterID}`
}
export function originLink(param) {
  return `/origin/${param}`
}

export function linkParser(type = "lightnovel", param) {
  switch (type) {
    case "manga":
      return mangaLink(param)
    default:
      return lightnovelLink(param)
  }
}

export function readLinkParser(type = "lightnovel", { mangaID, chapterID }) {
  switch (type) {
    case "lightnovel":
      return lightnovelReadLink({ mangaID, chapterID })
    default:
      return mangaReadLink({ mangaID, chapterID })
  }
}