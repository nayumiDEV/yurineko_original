import axios from 'axios'
import Cookies from 'universal-cookie'

export const BASE_API = process.env.BASE_API
export const BASE_LN_API = 'https://api-ln.yurineko.moe'
export const BASE_API_GATEWAY= process.env.BASE_API_GATEWAY
const cookies = new Cookies()

export default async function callApi({ url, method, data, option, baseUrl }) {
  // const token = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).token : ''\
  const user = cookies.get('user')
  const token = user ? user.token : ''

  const hostname = baseUrl || BASE_API;

  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `${hostname}${url}`,
      data,
      headers: { ...option?.headers, Authorization: `Bearer ${token}` },
      // ...option,
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export async function callApiGateway({ url, method, data, option}) {
  const user = cookies.get('user')
  const token = user ? user.token : ''

  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `${BASE_API_GATEWAY}${url}`,
      data,
      headers: { ...option?.headers, Authorization: `Bearer ${token}` },
      // ...option,
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export async function callLightnovelApi({ url, method, data, option }) {
  // const token = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).token : ''\
  const user = cookies.get('user')
  const token = user ? user.token : ''
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `${BASE_LN_API}${url}`,
      data,
      headers: { ...option?.headers, Authorization: `Bearer ${token}` },
      // ...option,
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

export async function callApiWithCapcha({ url, method, data, option }) {
  // const token = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).token : ''\
  const user = cookies.get('user')
  const token = user ? user.token : ''
  const captcha = localStorage.getItem('g-recaptcha-response')
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `${BASE_API}${url}`,
      data,
      headers: {
        ...option?.headers,
        Authorization: `Bearer ${token}`,
        'g-recaptcha-response': captcha ?? '',
      },
      // ...option,
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

const resources = {}

const makeRequestCreator = () => {
  let cancel
  const user = cookies.get('user')
  const token = user ? user.token : ''

  return async (query) => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel()
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source()
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query]
      }
      const res = await axios(query, {
        cancelToken: cancel.token,
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = res.data
      // Store response
      resources[query] = result

      return result
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
      } else {
        // Handle usual errors
      }
    }
  }
}

export const search = makeRequestCreator()
