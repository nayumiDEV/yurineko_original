export function mangaStatus(status) {
  const value = {
    1: 'Chưa ra mắt',
    2: 'Đã xong',
    3: 'Sắp ra mắt',
    4: 'Đang tiến hành',
    5: 'Ngừng dịch',
    6: 'Tạm ngưng',
    7: 'Ngừng xuất bản',
  }
  return value[status]
}
