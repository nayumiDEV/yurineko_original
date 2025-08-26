export default function createUrlName(name) {
  return String(name)
    .trim()
    .split(' ')
    .map((word) => upperFirstLetter(word))
    .join('')
}

function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
