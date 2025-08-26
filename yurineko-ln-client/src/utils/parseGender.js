export default function parseGender(gender) {
  return gender == 1 ? 'Nam' : gender == 0 ? 'Nữ' : 'Khác'
}
