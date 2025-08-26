export default function parseTypeReport(type) {
  let text = ''
  switch (type) {
    case 1:
      text = 'Lỗi ảnh, không load được ảnh'
      break
    case 2:
      text = 'Sai thứ tự chapter'
      break
    case 3:
      text = 'Chapter bị trùng'
      break
    case 4:
      text = 'Up sai truyện'
      break
    case 5:
      text = 'Chapter chưa dịch (RAW)'
      break
    case 6:
      text = 'Lỗi khác'
      break
  }
  return text
}
