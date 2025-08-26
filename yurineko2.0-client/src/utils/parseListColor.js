export default function parseListColor(listKey) {
  return listKey == 'will'
    ? 'bg-button-will'
    : listKey == 'done'
    ? 'bg-button-done'
    : listKey == 'follow'
    ? 'bg-button-follow'
    : listKey == 'stop'
    ? 'bg-button-stop'
    : ''
}
