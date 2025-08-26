const num = 20

export default function parsePageToMinMax({ page, max }) {
  if (page < 0) return [0, 0]
  else if (page >= 1) return [(page - 1) * num, page * num - 1 > max - 1 ? max : page * num - 1]
}
