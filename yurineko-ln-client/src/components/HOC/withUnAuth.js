import useAuth from '@/hooks/useAuth'
import { parseCookies } from '@/utils/parseCookie'
import withConditionalRedirect from './withConditionalRedirect'

/**
 * Require the user to be unauthenticated in order to render the component.
 * If the user is authenticated, forward to the given URL.
 */
export default function withoutAuth(WrappedComponent, location = '/') {
  const user = useAuth()
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withoutAuthClientCondition() {
      if (user && user.token) return true
      else return false
    },
    serverCondition: async function withoutAuthServerCondition({ req, ...ctx }) {
      try {
        const cookie = parseCookies(req)
        const user = cookie.user
        if (user && user.token) return true
        else return false
      } catch (e) {
        return false
      }
    },
  })
}
