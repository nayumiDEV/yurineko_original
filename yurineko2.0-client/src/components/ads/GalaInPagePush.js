import useAuth from '@/hooks/useAuth'
import { Helmet } from 'react-helmet'

export default function GalaInPagePush() {
  const auth = useAuth()

  return (
    <Helmet>
      {!auth || !auth.token || (auth.role == 1 && !auth.isPremium) ? (
        <script data-cfasync="false" async type="text/javascript" src="//thulrlidos.com/f1GfVm7KF5rO/61711"></script>
      ) : (
        ''
      )}
    </Helmet>
  )
}