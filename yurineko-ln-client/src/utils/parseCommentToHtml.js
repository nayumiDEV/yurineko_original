String.prototype.escape = function () {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag
  })
}

const BASE_STORAGE = process.env.BASE_STORAGE

export default function parseCommentToHtml(comment) {
  comment = comment.escape()
  return comment
    .replace(/((\[\*)(\d+)(\*\]))/g, (match) => {
      return `<img src="${BASE_STORAGE}/emoji/QooBee/qiubilong_${match
        .replace(/[\[\]\*]/g, '')
        .replace(/[\[\]\*]/g, '')
        .replace(/[\[\]\*]/g, '')}.gif" alt="icon" class="inline-sticker" />`
    })
    .replace(/&lt;br&gt;/g, '</br>')
    .replace(/&amp;nbsp;/g, '<span> </span>')
}
