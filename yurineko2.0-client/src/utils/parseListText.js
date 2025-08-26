export default function parseListText(listKey) {
  return listKey == 'will'
    ? 'Sẽ đọc'
    : listKey == 'done'
    ? 'Đã đọc'
    : listKey == 'follow'
    ? 'Theo dõi'
    : listKey == 'stop'
    ? 'Ngừng đọc'
    : ''
}
