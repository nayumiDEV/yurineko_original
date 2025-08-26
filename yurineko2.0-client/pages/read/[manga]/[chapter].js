import { ClickAduBanner } from '@/components/ads/ClickAdu'
import CustomBanner, { FreeCustomBanner } from '@/components/ads/CustomAds'
import RowAds from '@/components/ads/RowAds'
import LoveButtonInChapter from '@/components/button/LoveButtonInChapter'
import SubscribeMangaInChapter from '@/components/button/SubscribeMangaInChapter'
import Comment from '@/components/comment/Comment'
import Report from '@/components/form/Report'
import BlockLoading from '@/components/loading/BlockLoading'
import Reaction from '@/components/reaction/Reaction'
import ListSelectChapter from '@/components/select/ListSelectChapter'
import ListSelectInChapter from '@/components/select/ListSelectInChapter'
import ListSelectInChapterShort from '@/components/select/ListSelectInChapterShort'
import TeamFollow from '@/components/team/TeamFollow'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import LayoutHome from '@/layouts/Home'
import { mangaLink, mangaReadLink } from '@/utils/generateLink'
import { timeFromNow } from '@/utils/timeUpdate'
import { Affix } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import cookies from 'next-cookies'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { BASE_API } from '../../../api'
import LikeChapterButton from '../../../src/components/button/LikeChapterButton'
import dynamic from 'next/dynamic'

const BidGearAdsDynamic = dynamic(
  import('../../../src/components/ads/BidGear').then((mod) => mod.BidGearAds),
  { ssr: false }
)

function Read(props) {
  const [isStick, changeStick] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [is_visible, setVisible] = useState(false)

  const { chapterData, teamData } = props
  const chapterRes = chapterData
  const team = teamData

  const { chapterInfo, mangaInfo, url, listChapter } = chapterRes
  const nowIndex = listChapter ? listChapter.findIndex((item) => item.id == chapterInfo.id) : 0
  const handleOpenReportModal = () => {
    setShowReportModal(true)
  }

  const onChangeStick = (status) => {
    changeStick(status)
  }

  const changeChapter = (e) => {
    if (e.target) {
      window.location.replace(mangaReadLink({ mangaID: mangaInfo.id, chapterID: e.target.value }))
    } else {
      window.location.replace(mangaReadLink({ mangaID: mangaInfo.id, chapterID: e }))
    }
  }

  function onNext() {
    if (nowIndex == 0) return
    else changeChapter(listChapter[nowIndex - 1].id)
  }

  function onPrev() {
    if (nowIndex + 1 == listChapter.length) return
    else changeChapter(listChapter[nowIndex + 1].id)
  }

  let progressBarHandler = () => {
    const totalScroll = document.documentElement.scrollTop
    const windowHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    const currentScroll = totalScroll / windowHeight
    setScroll(currentScroll)
  }

  const arrowKeyHandler = ({ key }) => {
    if (key === 'ArrowLeft') {
      onPrev()
    } else if (key === 'ArrowRight') {
      onNext()
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', arrowKeyHandler)
    window.addEventListener('scroll', progressBarHandler)

    return () => {
      window.removeEventListener('keyup', arrowKeyHandler)
      window.removeEventListener('scroll', progressBarHandler)
    }
  }, [])

  if (_.isEmpty(chapterRes)) return <BlockLoading isLoading={true} />
  return (
    <LayoutHome>
      <ScrollToTop
        setParent={(status) => {
          setVisible(status)
        }}
      />
      <Helmet>
        <title>{`${mangaInfo.originalName} | ${chapterInfo.name}`}</title>
      </Helmet>
      <Report
        visible={showReportModal}
        chapterID={chapterInfo.id}
        mangaID={mangaInfo.id}
        setShowReportModal={setShowReportModal}
      />
      <div className="container mx-auto xl:px-40">
        <FreeCustomBanner url="https://temu.to/k/ud2q7uz3w8v" image="/img/temu-banner.jpg" />
        <div className="pt-2 flex items-center justify-center">
          <TeamFollow item={team} />
        </div>
        <Link href={mangaLink(mangaInfo.id)}>
          <h2 className="mt-3 text-4xl text-center font-semibold text-gray-dark dark:text-dark-text">
            {mangaInfo.originalName}
          </h2>
        </Link>

        <div className="mt-2 flex container max-w-3xl items-center justify-between mx-auto px-2">
          <h3 className="px-2 md:px-0 text-2xl font-normal text-gray dark:text-dark-text">
            {chapterInfo.name}
          </h3>
          <p className="italic text-xl font-normal text-gray dark:text-dark-text">
            {timeFromNow(chapterInfo.date)}
          </p>
        </div>
        <div className={`bg-white dark:bg-dark py-2 `}>
          <div className="flex container max-w-xl items-center justify-between mx-auto px-2">
            <Link href="/">
              <button className="h-10 rounded bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center">
                <i className="fas fa-home"></i>
              </button>
            </Link>
            <ListSelectInChapter
              mangaId={mangaInfo.id}
              defaultListKey={mangaInfo.userData?.list ?? null}
            />
            <LoveButtonInChapter
              mangaId={mangaInfo.id}
              defaultValue={mangaInfo.userData?.like ?? false}
            />
            <SubscribeMangaInChapter
              mangaId={mangaInfo.id}
              defaultValue={mangaInfo.userData?.subscribe ?? false}
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
                mangaId={mangaInfo.id}
                defaultListKey={mangaInfo.userData?.list ?? null}
              />
            )}
            {isStick && (
              <LikeChapterButton
                //Like manga btn
                mangaId={mangaInfo.id}
                defaultValue={mangaInfo.userData?.like ?? false}
              />
            )}

            {nowIndex < listChapter.length - 1 && (
              <button
                onClick={onPrev}
                className="ml-2 h-10 py-2 rounded ml-1 bg-pink font-semibold text-2xl text-white px-3 py-2 flex items-center justify-center"
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
                mangaId={mangaInfo.id}
                defaultValue={mangaInfo.userData?.subscribe ?? false}
              />
            )}
          </div>
        </div>
      </Affix>
      <RowAds />
      {/* image  */}
      <div className=" mx-auto w-full">
        <div className="mt-3 w-full">
          <div style={{ maxWidth: 1200 }} className="flex items-center justify-center mx-auto">
            <BidGearAdsDynamic />
          </div>
          {url
            .sort((b, a) => {
              return a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: 'base',
              })
            })
            .reverse()
            .map((item, index) => (
              <div
                id={`img-${index}`}
                style={{ maxWidth: 1200 }}
                className=" flex items-center justify-center  mx-auto"
              >
                <img
                  src={item}
                  alt={`Hình ảnh ${index}`}
                  className="min-h-full max-w-full"
                  fallBack="Không thể load ảnh này"
                  preview={false}
                  // fallbackImage="https://images.unsplash.com/photo-1613524952841-d630936f6388?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                />
                {/* </LazyLoad> */}
              </div>
            ))}
        </div>
      </div>
      <div>
        <div className="w-64 mx-auto mb-2 mt-2">
          <Reaction
            sourceType="chapter"
            id={chapterInfo.id}
            reactionInfo={chapterData.reactionInfo}
            userData={chapterInfo.userData}
          />
        </div>
        {/* <LikeChapter
          likeCount={chapterInfo.likeCount}
          chapterId={chapterInfo.id}
          defaultValue={chapterInfo.userData?.like ?? false}
        /> */}
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
      <div className="mt-2 flex items-center justify-center">
        <ClickAduBanner id="1992196" />
      </div>
      <div className="container mx-auto xl:px-40">
        <CustomBanner url={'https://discord.gg/8pf75zZPkW'} image={'/img/discord_banner.jpg'} />
      </div>
      <div id="comment" className="container mx-auto xl:px-40">
        <div className="mt-3 p-2">
          <h2 className="text-2xl text-pink font-semibold">
            <i className="fas fa-comments"></i> Bình luận
          </h2>
          <Comment mangaID={mangaInfo.id} chapterID={chapterInfo.id} />
        </div>
      </div>
    </LayoutHome>
  )
}

Read.getInitialProps = async (ctx) => {
  try {
    const { manga, chapter } = ctx.query
    const { user } = cookies(ctx)
    if (manga && chapter) {
      const header = user ? { Authorization: `Bearer ${user.token}` } : {}
      const res = await axios({
        method: 'get',
        url: `${BASE_API}/read/${manga}/${chapter}`,
        headers: header,
      })

      const teamID = res.data.mangaInfo.teamID
      const teamData = await axios({
        method: 'get',
        url: `${BASE_API}/team/${teamID}`,
        headers: header,
      })
      return { chapterData: res.data, teamData: teamData.data }
    }
  } catch (err) {
    if (err.response?.status == 401) {
      ctx.res.writeHead(301, {
        Location: `/account?url=${ctx.asPath}`,
      })
      ctx.res.end()
    }
    return { chapterData: false }
  }
}

export default Read
