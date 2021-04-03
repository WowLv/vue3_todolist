import moment from 'moment'

const timeFormat = (time='', formatString = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(time).format(formatString)
}

export default {
  timeFormat
}