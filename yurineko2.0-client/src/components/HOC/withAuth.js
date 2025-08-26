import useAuth from '@/hooks/useAuth'
import { parseCookies } from '@/utils/parseCookie'
import withConditionalRedirect from './withConditionalRedirect'

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
 */
export default function withAuth(WrappedComponent, location = '/account') {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withAuthClientCondition() {
      const user = useAuth()
      if (user && user.token) return false
      else return true
    },
    serverCondition: function withAuthServerCondition(ctx) {
      try {
        const cookie = parseCookies(req)
        const user = cookie.user ? JSON.parse(cookie.user) : ''
        if (!user || !user.token) return true
        else return false
      } catch {
        return false
      }
    },
  })
}
