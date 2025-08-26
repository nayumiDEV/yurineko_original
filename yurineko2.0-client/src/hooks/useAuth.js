import isClient from '../utils/isClient'
import Cookies from 'universal-cookie'

export default function useAuth() {
  if (isClient()) {
    const cookies = new Cookies()
    const user = cookies.get('user')
    if (user) {
      return user
    } else return null
  }
}
