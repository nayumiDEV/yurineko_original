import { getTeam } from 'api/general'
import React, { useEffect, useState, useMemo } from 'react'
import { Affix, message, Select } from 'antd'
import LayoutHome from '@/layouts/Home'
import LazyLoad from 'react-lazyload'
import Comment from '@/components/comment/Comment'
import Link from 'next/link'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import _ from 'lodash'
import Report from '@/components/form/Report'
import { timeFromNow } from '@/utils/timeUpdate'
import { lightnovelLink, lightnovelReadLink } from '@/utils/generateLink'
import { useRouter } from 'next/router'
import ReactImageFallback from 'react-image-fallback'
import BlockLoading from '@/components/loading/BlockLoading'
import LikeChapterButton from '../../src/components/button/LikeChapterButton'
import LikeChapter from '../../src/components/button/LikeChapter'
import SubscribeMangaInChapter from '@/components/button/SubscribeMangaInChapter'
import { Helmet } from 'react-helmet'
import LoveButtonInChapter from '@/components/button/LoveButtonInChapter'
import ListSelectInChapter from '@/components/select/ListSelectInChapter'
import handleErrorApi from '@/utils/handleErrorApi'
import ListSelectChapter from '@/components/select/ListSelectChapter'
import ListSelectInChapterShort from '@/components/select/ListSelectInChapterShort'
import GoogleAd from '@/components/ads/GGAds'
import FrameAds from '@/components/ads/FrameAds'
import RowAds from '@/components/ads/RowAds'
import HelpBanner from '@/components/banner/HelpBanner'
import PremiumAds from '@/components/ads/PremiumAds'
import TeamFollow from '@/components/team/TeamFollow'
import cookies from 'next-cookies'
import { BASE_API } from '../../api'
import axios from 'axios'
import edjsParser from 'editorjs-parser'
import { NextSeo } from 'next-seo'

const customParsers = {
  paragraph: function (data, config) {
    return `<div class="paragraph">
      <p class="paragraph-content align-${data.alignment ?? 'none'}">
        ${data.text}
      </p>
    </div>`
  },
  header: function (data, config) {
    return `<h${data.level} class="align-${data.tunes?.align?.alignment ?? 'none'}">${
      data.text
    }</h${data.level}>`
  },
  delimiter: function (data, config) {
    return `<div class="delimiter">
      
    </div>`
  },
}
const parser = new edjsParser(undefined, customParsers)

function Read(props) {
  const [isStick, changeStick] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [nowIndex, setIndex] = useState(0)
  // const [chapterData, setChapter] = useState('')
  const [open, setOpen] = useState(false)
  const [y, setY] = useState(0)
  const [is_visible, setVisible] = useState(false)
  const route = useRouter()
  const [teamData, setTeamData] = useState('')
  const [sizeText, setSizeText] = useState(16)
  const [loading, setLoading] = useState(true)
  const { chapterData } = props

  const { chapterInfo, lightnovelInfo, url, listChapter } = chapterData

  useEffect(
    () =>
      (async () => {
        if (lightnovelInfo) {
          const teamID = lightnovelInfo.teamID
          const res = await getTeam(teamID)
          setTeamData(res)
          setLoading(false)
        }
      })(),
    [lightnovelInfo]
  )

  const handleOpenReportModal = () => {
    setShowReportModal(true)
  }

  const onChangeStick = (status) => {
    changeStick(status)
  }

  const changeChapter = (e) => {
    if (e.target) {
      window.location.replace(lightnovelReadLink({ mangaID: lightnovelInfo.id, chapterID: e.target.value }))
    } else {
      window.location.replace(lightnovelReadLink({ mangaID: lightnovelInfo.id, chapterID: e }))
    }
  }

  useEffect(() => {
    setIndex(listChapter ? listChapter.findIndex((item) => item.id == chapterInfo.id) : 0)
  }, [chapterInfo.id, listChapter])

  useEffect(() => {
    const defaultSize = parseInt(localStorage.getItem('fontSize') ?? '16')
    setSizeText(defaultSize)
  }, [])

  const onNext = () => {
    if (nowIndex == 0) return
    else changeChapter(listChapter[nowIndex - 1].id)
  }

  const onPrev = () => {
    if (nowIndex + 1 == listChapter.length) return
    else changeChapter(listChapter[nowIndex + 1].id)
  }

  const onIncreaseSize = () => {
    if (sizeText < 22) {
      setSizeText(sizeText + 1)
      localStorage.setItem('fontSize', sizeText + 1)
    }
  }

  const onDecreaseSize = () => {
    if (sizeText > 10) {
      setSizeText(sizeText - 1)
      localStorage.setItem('fontSize', sizeText - 1)
    }
  }

  let progressBarHandler = () => {
    const totalScroll = document.documentElement.scrollTop
    const windowHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    const currentScroll = totalScroll / windowHeight
    setScroll(currentScroll)
  }

  useEffect(() => {
    window.addEventListener('scroll', progressBarHandler)

    return () => window.removeEventListener('scroll', progressBarHandler)
  }, [])

  const htmlData = useMemo(() => {
    const content = JSON.parse(chapterInfo.content)
    const blocks = content.blocks.map((item) => ({
      ...item,
      ['data']: {
        ...item.data,
        ['tunes']: item.tunes,
      },
    }))
    content.blocks = blocks

    return parser.parse(content)
  }, [chapterInfo])

  if (_.isEmpty(chapterData) || loading) return <BlockLoading isLoading={true} />

  return (
    <LayoutHome className="wrapper min-h-screen bg-read-light dark:bg-read-dark">
      <GoogleAd />
      <ScrollToTop
        setParent={(status) => {
          setVisible(status)
          if (status == false) setOpen(false)
        }}
      />
      <NextSeo title={`${lightnovelInfo.originalName} | ${chapterInfo.name}`} />

      <Report
        visible={showReportModal}
        chapterID={chapterInfo.id}
        mangaID={lightnovelInfo.id}
        setShowReportModal={setShowReportModal}
      />

      {isStick == true && is_visible == true && (
        <div className="fixed bottom-16 w-12 right-3 flex flex-col z-top opacity-70">
          <button
            onClick={onIncreaseSize}
            className="h-10 w-10 rounded-full my-1 bg-pink text-white"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            onClick={onDecreaseSize}
            className="h-10 w-10 rounded-full my-1 bg-pink text-white"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      )}

      <div className="container mx-auto xl:px-40">
        <div className="pt-2 flex items-center justify-center">
          <FrameAds />
        </div>
        {teamData && (
          <div className="pt-2 flex items-center justify-center">
            <TeamFollow item={teamData} />
          </div>
        )}
        <Link href={lightnovelLink(lightnovelInfo.id)}>
          <h2 className="mt-3 text-4xl text-center font-semibold text-gray-dark dark:text-dark-text cursor-pointer">
            {lightnovelInfo.originalName}
          </h2>
        </Link>

        <div className="mt-2 flex container max-w-3xl items-center justify-between mx-auto px-2">
          <h3 className="px-2 md:px-0 text-2xl font-normal text-gray dark:text-dark-text">
            {chapterInfo.name}
          </h3>
          <p className="italic text-xl font-normal text-gray dark:text-dark-text">
            {timeFromNow(chapterInfo.updateAt)}
          </p>
        </div>
        <div className={`bg-read-light dark:bg-read-dark py-2 `}>
          <div className="flex container max-w-xl items-center justify-between mx-auto px-2">
            <Link href="/">
              <button className="h-10 rounded bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center">
                <i className="fas fa-home"></i>
              </button>
            </Link>
            <ListSelectInChapter
              mangaId={lightnovelInfo.id}
              defaultListKey={lightnovelInfo.userData?.list ?? null}
            />
            <LoveButtonInChapter
              mangaId={lightnovelInfo.id}
              defaultValue={lightnovelInfo.userData?.like ?? false}
            />
            <SubscribeMangaInChapter
              mangaId={lightnovelInfo.id}
              defaultValue={lightnovelInfo.userData?.subscribe ?? false}
            />
            <a
              href="#comment"
              className="hover:text-white h-10 rounded bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center"
            >
              <i className="far fa-comments"></i>
            </a>
          </div>
        </div>
      </div>
      {/* fixed header  */}
      <div
        className={`${isStick == true ? 'progress-read' : ''}`}
        style={{ width: `${scroll * 100}%` }}
      ></div>
      <Affix offsetTop={0} onChange={onChangeStick}>
        <div
          //  className={`}`}
          className={`${isStick == true ? 'shadow bg-white dark:bg-dark-black' : ''}  
        transform ${is_visible == true || isStick == false ? '-translate-y-0' : '-translate-y-20'}
        `}
        >
          <div className="flex items-center justify-around mx-auto w-full md:w-4/5 max-w-2xl p-2">
            {isStick == true && (
              <Link href="/">
                <button
                  className={`flex text-3xl rounded font-semibold text-base text-gray-500 px-2 py-2 items-center justify-center`}
                >
                  <i className="fas fa-home"></i>
                </button>
              </Link>
            )}

            {isStick == true && (
              <ListSelectInChapterShort
                mangaId={lightnovelInfo.id}
                defaultListKey={lightnovelInfo.userData?.list ?? null}
              />
            )}
            {isStick && (
              <LikeChapterButton
                //Like manga btn
                mangaId={lightnovelInfo.id}
                defaultValue={lightnovelInfo.userData?.like ?? false}
              />
            )}
            {isStick == false && (
              <>
                <button
                  onClick={onIncreaseSize}
                  className="h-10 w-10 rounded-full mx-1 bg-pink text-white"
                >
                  <i className="fas fa-plus"></i>
                </button>
                <button
                  onClick={onDecreaseSize}
                  className="h-10 w-10 rounded-full mx-1 bg-pink text-white"
                >
                  <i className="fas fa-minus"></i>
                </button>
              </>
            )}
            {nowIndex < listChapter.length - 1 && (
              <button
                onClick={onPrev}
                className=" h-10 py-2 rounded ml-1 bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center"
              >
                <i className="fas fa-angle-left"></i>
              </button>
            )}
            <div className="h-10 py-0 relative flex-1 w-1/3 md:w-2/5 px-2 text-base font-normal chapter-select flex justify-center items-center">
              <ListSelectChapter
                changeChapter={changeChapter}
                listChapter={listChapter}
                chapterInfo={chapterInfo}
              />
            </div>
            {nowIndex > 0 && (
              <button
                onClick={onNext}
                className="h-10 py-2 mr-1 rounded bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center"
              >
                <i className="fas fa-angle-right"></i>
              </button>
            )}
            {isStick == false && (
              <button
                onClick={handleOpenReportModal}
                className="h-10 py-2 block leading-none rounded bg-yellow-500 font-normal text-base text-white px-3 py-2 flex items-center justify-center"
              >
                Báo lỗi
              </button>
            )}
            {isStick == true && (
              <SubscribeMangaInChapter
                mangaId={lightnovelInfo.id}
                defaultValue={lightnovelInfo.userData?.subscribe ?? false}
              />
            )}
          </div>
        </div>
      </Affix>
      <RowAds />

      {/* content  */}
      <div
        className="container mx-auto px-4 xl:px-40 chapter-content dark:text-dark-text mt-5 select-none"
        style={{ fontSize: sizeText }}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlData }} className="mx-auto w-full "></div>
      </div>
      {/*  */}

      <div>
        <LikeChapter
          likeCount={chapterInfo.likeCount}
          chapterId={chapterInfo.id}
          defaultValue={chapterInfo.userData?.like ?? false}
        />
        <div className="max-w-sm w-full flex items-center justify-center mx-auto">
          {nowIndex < listChapter.length - 1 && (
            <button
              onClick={onPrev}
              className="h-10 mr-1 rounded bg-pink font-semibold text-base text-white px-2 py-1 flex items-center justify-center"
            >
              Quay lại
            </button>
          )}
          <div className="h-10 relative flex-1 md:w-3/6 px-2 text-base font-normal chapter-select flex justify-center items-center">
            <ListSelectChapter
              changeChapter={changeChapter}
              listChapter={listChapter}
              chapterInfo={chapterInfo}
            />
          </div>
          {nowIndex > 0 && (
            <button
              onClick={onNext}
              className="h-10 ml-1 rounded bg-pink font-semibold text-base text-white px-2 py-1 flex items-center justify-center"
            >
              Kế tiếp
            </button>
          )}
        </div>
      </div>
      <RowAds />
      <HelpBanner />
      <div className="flex items-center justify-center">
        <PremiumAds />
      </div>

      <div id="comment" className="container mx-auto xl:px-40">
        <div className="mt-3 p-2">
          <h2 className="text-2xl text-pink font-semibold">
            <i className="fas fa-comments"></i> Bình luận
          </h2>
          <Comment mangaID={lightnovelInfo.id} chapterID={chapterInfo.id} />
        </div>
      </div>
    </LayoutHome>
  )
}

Read.getInitialProps = async (ctx) => {
  try {
    const { manga, chapter } = ctx.query
    const { user } = cookies(ctx)
    if (chapter) {
      const header = user ? { Authorization: `Bearer ${user.token}` } : {}
      const res = await axios({
        method: 'get',
        url: `${process.env.BASE_URL_LN}/chapter/${chapter}`,
        headers: header,
      })
      return { chapterData: res.data }
    }
  } catch (err) {
    if (err.response?.status == 404) {
      ctx.res.writeHead(301, {
        Location: `/404`,
      })
      ctx.res.end()
    } else if (err.response?.status == 401) {
      ctx.res.writeHead(301, {
        Location: `/account?url=${ctx.asPath}`,
      })
      ctx.res.end()
    }
    return { chapterData: false }
  }
}

export default Read
