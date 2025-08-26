import moment from 'moment'

moment.locale('vi')

export default function timeUpdate(time) {
  const dateTime = new Date(time)

  return `${dateTime.toLocaleTimeString('vi')} ${dateTime.toLocaleDateString('vi')}`
}

export function timeFromNow(time) {
  // const dateTime = new Date(time.replace('.000Z', ''))
  return moment.utc(time).local().fromNow()
}


export function getDate(time) {
  const dateTime = new Date(time)

  return `${dateTime.toLocaleDateString('vi')}`
}

export function daysRemaining(time) {
  var eventdate = moment(time)
  var todaysdate = moment()
  return eventdate.diff(todaysdate, 'days')
}
