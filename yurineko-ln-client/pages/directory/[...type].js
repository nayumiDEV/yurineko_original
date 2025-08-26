import LayoutHome from '@/layouts/Home'
import handleErrorApi from '@/utils/handleErrorApi'
import { getAuthor, getTag, getCouple, getOrigin, getTeam, getDoujin } from 'api/general'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  authorLink,
  coupleLink,
  lightnovelLink,
  originLink,
  tagLink,
  teamLink,
} from '@/utils/generateLink'
import BlockLoading from '@/components/loading/BlockLoading'
import DirectoryMenu from '@/components/menu/DirectoryMenu'
import GoogleAd from '@/components/ads/GGAds'
import RowAds from '@/components/ads/RowAds'

export default function directory() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const route = useRouter()
  const type = route.query.type ? route.query.type[0] : 'tag'

  useEffect(() => {
    if (type) {
      let getData = null
      if (type == 'author') getData = getAuthor
      if (type == 'tag') getData = getTag
      if (type == 'couple') getData = getCouple
      if (type == 'doujin') getData = getOrigin
      if (type == 'team') getData = getTeam

      setLoading(true)
      getData &&
        getData()
          .then((res) => {
            const showData = res.reduce((r, e) => {
              var english = /^[A-Za-z]*$/
              let group = String(e.name[0]).toLocaleUpperCase()

              if (!r['#']) {
                r['#'] = { group: '#', children: [] }
              }

              if (!r[group] && english.test(group)) r[group] = { group, children: [e] }
              else if (r[group] && english.test(group)) {
                r[group].children.push(e)
              } else r['#'].children.push(e)
              return r
            }, {})
            let result = Object.values(showData)
            setData(result)
            setLoading(false)
          })
          .catch((err) => {
            handleErrorApi(err)
          })
    }
  }, [type])

  // let showData = data
  //   ? data.reduce((r, e) => {
  //       let group = e.name[0]
  //       if (!r[group]) r[group] = { group, children: [e] }
  //       else r[group].children.push(e)
  //       return r
  //     }, {})
  //   : []

  // let result = Object.values(showData)

  // console.log(result)
  return (
    <LayoutHome>
      <GoogleAd />
      <div className="container mx-auto xl:px-40"></div>
      <DirectoryMenu type={type} />
      <RowAds top />

      {loading ? (
        <BlockLoading isLoading={true} />
      ) : (
        <div className="container mx-auto xl:px-40">
          <div className="grid directory ">
            {data &&
              data
                .sort((a, b) => (a.group < b.group ? -1 : 1))
                .map((item) => (
                  <div className="border-l-2 border-gray-link pl-2">
                    <p className="text-base mb-2 dark:text-dark-text">{item.group}</p>
                    {item.children.map((child) => (
                      <Link
                        href={
                          type == 'tag'
                            ? tagLink(child.id)
                            : type == 'doujin'
                            ? originLink(child.id)
                            : type == 'author'
                            ? authorLink(child.id)
                            : type == 'couple'
                            ? coupleLink(child.id)
                            : type == 'team'
                            ? teamLink(child.id)
                            : ''
                        }
                      >
                        <a className="text-base text-blue block w-full underline">{child.name}</a>
                      </Link>
                    ))}
                  </div>
                ))}
          </div>
        </div>
      )}
      <RowAds top={false} />
    </LayoutHome>
  )
}
