import useAuth from '@/hooks/useAuth'
import { Helmet } from 'react-helmet'

export function GalaFloatingButtonAds() {
  const auth = useAuth()
  return (
    <Helmet>
      {!auth || !auth.token || (auth.role == 1 && auth.isPremium == false) ? (
        <script data-cfasync="false" async type="text/javascript" src="//pyxiscablese.com/tKvzAfWbypvYxzvh/56936"></script>
      ) : (
        ''
      )}
    </Helmet>
  )
}
