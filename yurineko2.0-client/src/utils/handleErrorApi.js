import { message } from 'antd'
import { logout } from 'src/redux/actions'
import store from 'src/redux/store'

export default function handleErrorApi(err) {
  if (!err.response || !err.response.status) {
    // alert(JSON.stringify(err))
    // window.location.href = '/500'
  } else {
    const status = err.response.status

    if (status == 401) {
      // alert('Bạn phải đăng nhập để thực hiện hành động này!')
      // store.dispatch(logout())
      //   if (!user) localStorage.clear()
    }
    if (status == 400) {
      message.error(err.response.data.message ?? 'Có lỗi xảy ra')

      //   window.location.href = '/500'

      console.log(err)
    } else if (status == 404) {
      // console.log(err)
      window.location.href = '/404'
    } else if (status == 429) {
      message.warning('Thao tác quá nhanh, xin thử lại.')
    } else if (status == 403) {
      message.error('Bạn phải đăng nhập để thực hiện hành động này')
    } else {
      message.error(err.response.data.message ?? 'Có lỗi xảy ra')
    }
  }
}
