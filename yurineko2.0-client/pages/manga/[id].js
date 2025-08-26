import CustomBanner from '@/components/ads/CustomAds'
import RowAds from '@/components/ads/RowAds'
import Banner from '@/components/banner/Banner'
import LoveButton from '@/components/button/LoveButton'
import SubscribeManga from '@/components/button/SubscribeManga'
import Comment from '@/components/comment/Comment'
import ChapterList from '@/components/list/ChapterList'
import TagList from '@/components/list/TagList'
import YuriTagList from '@/components/list/YuriTagList'
import BlockLoading from '@/components/loading/BlockLoading'
import ListSelect from '@/components/select/ListSelect'
import ScrollToTop from '@/components/toggle/ScrollToTop'
import LayoutHome from '@/layouts/Home'
import { authorLink, mangaReadLink, originLink, teamLink } from '@/utils/generateLink'
import imgLink from '@/utils/imgLink'
import { mangaStatus } from '@/utils/mangaStatus'
import timeUpdate from '@/utils/timeUpdate'
import { Col, Row } from 'antd'
import { getManga } from 'api/general'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// import ScrollToTop from '@/components/Button/ScrollToTop'

function manga({ banner, ...props }) {
  const [isLoading, setIsloading] = useState(true)
  const [manga, setManga] = useState('')
  const route = useRouter()
  const { id } = route.query

  useEffect(async () => {
    if (id) {
      const res = await getManga(id)
      if (res) {
        setManga(res)
        setIsloading(false)
      }
    }
  }, [id])

  return (
    <LayoutHome>
      <Banner url={process.env.BANNER_MANGA} />
      <RowAds top />

      {isLoading ? (
        <BlockLoading isLoading={isLoading} />
      ) : (
        <>
          <Helmet>
            <title>{manga.originalName}</title>
            <meta property="og:title" content={manga.originalName} />
            <meta property="og:image:secure_url" content={imgLink(manga.thumbnail)} />
          </Helmet>
          <ScrollToTop />
          <div className="container mx-auto xl:px-40" id={'manga' + manga.originalName}>
            <div className="mt-2 shadow-md bg-white dark:bg-dark-black dark:text-dark-text rounded-md overflow-hidden">
              <div className="rounded-md shadow-md p-2 flex justify-between items-center bg-gray-100 dark:bg-dark-black">
                <h2
                  style={{ fontSize: '1.5rem' }}
                  className="font-bold md:text-2xl dark:text-dark-text"
                >
                  <i className="fas fa-book"></i> {manga.originalName}
                </h2>
                <SubscribeManga
                  customClass="hidden md:flex p-2 rounded-md text-base items-center justify-center border-2"
                  mangaId={manga.id}
                  defaultSubscribe={manga.userData?.subscribe ?? false}
                />
              </div>
              <div className="mt-1 px-2 py-3 justify-between items-center bg-white dark:bg-dark-gray-light">
                <Row gutter={12}>
                  <Col xs={24} md={7}>
                    <div className="md:m-0 m-2 mx-auto w-full flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
                      <img
                        className="object-fill max-w-full max-h-full flex-shrink-0"
                        src={imgLink(manga.thumbnail)}
                        alt="thumbnail"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={17}>
                    <div className="p-2">
                      <p className="text-md font-normal md:text-xl">
                        <span className="font-semibold mr-2">Tên khác:</span>
                        {manga.otherName ? manga.otherName : 'Đang cập nhật'}
                      </p>

                      <p className="text-md font-normal md:text-xl">
                        <span className="font-semibold mr-2">Tác giả:</span>
                        {manga.author.map((item, index) => (
                          <a href={authorLink(item.url ? item.url : item.id)}>
                            <span
                              style={{ color: '#2db5f2', fontSize: '1.2rem' }}
                              className={`text-gray-dark cursor-pointer hover:text-pink w-max`}
                            >
                              {item.name}
                              {index != manga.author.length - 1 ? ', ' : ''}
                            </span>
                          </a>
                        ))}
                      </p>
                      <p className="text-md font-normal md:text-xl">
                        <span className="font-semibold mr-2">Nhóm dịch:</span>
                        {manga.team[0] && (
                          <a
                            key={manga.team[0].id}
                            href={teamLink(
                              manga.team[0].url ? manga.team[0].url : manga.team[0].id
                            )}
                          >
                            <span
                              style={{ fontSize: '1.2rem' }}
                              className={`text-tag-team text-md cursor-pointer hover:text-pink w-max`}
                            >
                              {manga.team[0]?.name ?? 'Đang cập nhật'}
                            </span>
                          </a>
                        )}
                      </p>
                      {manga.type == 2 && (
                        <p className="text-md font-normal md:text-xl">
                          <span className="font-semibold mr-2">Truyện gốc:</span>
                          {manga.origin.map((item, index) => (
                            <a href={originLink(item.url ? item.url : item.id)}>
                              <span
                                style={{ color: '#2db5f2', fontSize: '1.2rem' }}
                                className={`text-gray-dark cursor-pointer hover:text-pink w-max`}
                              >
                                {item.name}
                                {index != manga.origin.length - 1 ? ', ' : ''}
                              </span>
                            </a>
                          ))}
                        </p>
                      )}
                      <div className="flex items-center flex-wrap">
                        <TagList tags={manga.tag} />
                        {manga.type == 2 && <YuriTagList tags={manga.couple} />}
                      </div>
                      <p className="text-md font-normal md:text-xl ">
                        <span className="font-semibold mr-2">Lượt xem:</span>{' '}
                        <span style={{ color: '#4899b1', fontSize: '1.2rem' }}>
                          {manga.totalView}
                        </span>
                      </p>
                      <p className="text-md font-normal md:text-xl">
                        <span className="font-semibold mr-2">Trạng thái:</span>
                        <span style={{ fontSize: '1.2rem' }}>{mangaStatus(manga.status)}</span>
                      </p>
                      <p className="text-md font-semibold md:text-xl mr-2">Mô tả:</p>
                      <p
                        style={{ fontSize: '1.1rem' }}
                        className={`font-normal`}
                        dangerouslySetInnerHTML={{ __html: manga.description }}
                      />
                      <p className="text-md font-normal md:text-xl">
                        <span className="font-semibold mr-2">Update:</span>
                        <span style={{ fontSize: '1.1rem' }} className="text-pink ">
                          {timeUpdate(manga.lastUpdate)}
                        </span>
                      </p>
                      <div className="mt-2 flex items-center justify-center md:hidden">
                        <SubscribeManga
                          customClass="mx-auto p-2 rounded-md text-base items-center justify-center border-2"
                          mangaId={manga.id}
                          defaultSubscribe={manga.userData?.subscribe ?? false}
                        />
                      </div>
                      <div className="md:hidden w-screen max-w-xs mx-auto flex flex-col justify-center mt-2">
                        <div className="flex items-center justify-around">
                          <ListSelect
                            mangaId={manga.id}
                            defaultListKey={manga.userData?.list ?? null}
                          />
                          <span className="font-bold mr-auto dark:text-dark-text">
                            {manga.totalFollow} người
                          </span>
                        </div>
                        <div className="flex items-center justify-around">
                          <LoveButton
                            mangaId={manga.id}
                            defaultCount={manga.likeCount}
                            defaultValue={manga.userData?.like ?? false}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="mt-4 shadow-md bg-white dark:bg-dark p-2 flex justify-between items-center rounded-md mb-4">
              <div className="hidden md:block w-screen max-w-xs">
                <div className="flex items-center ">
                  <ListSelect
                    mangaId={manga.id}
                    defaultCount={manga.totalFollow}
                    defaultListKey={manga.userData?.list ?? null}
                  />
                  <span className="font-bold dark:text-dark-text mr-auto">
                    {manga.totalFollow} người
                  </span>
                </div>
                <div className="flex items-center">
                  <LoveButton
                    mangaId={manga.id}
                    defaultCount={manga.likeCount}
                    defaultValue={manga.userData?.like ?? false}
                  />
                </div>
              </div>
              <div className="w-screen md:max-w-xs max-w-screen">
                <div className="flex item-center jusitfy-between">
                  <Link
                    href={mangaReadLink({
                      mangaID: manga.id,
                      chapterID: manga.chapters[manga.chapters.length - 1]?.id ?? '',
                    })}
                  >
                    <button className="flex-1 p-2 rounded-xl bg-white dark:bg-dark dark:text-dark-text border-2 font-bold m-1 hover:shadow">
                      Đọc từ đầu
                    </button>
                  </Link>
                  <Link
                    href={mangaReadLink({
                      mangaID: manga.id,
                      chapterID: manga.chapters[0]?.id ?? '',
                    })}
                  >
                    <button className="flex-1 p-2 rounded-xl bg-white dark:bg-dark dark:text-dark-text border-2 font-bold m-1 hover:shadow">
                      Đọc mới nhất
                    </button>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  {manga.userData && manga.userData.readChapter && (
                    <Link
                      href={mangaReadLink({
                        mangaID: manga.userData.readChapter.mangaID,
                        chapterID: manga.userData.readChapter.chapterID,
                      })}
                    >
                      <button className="p-2 rounded-xl bg-white dark:bg-dark dark:text-dark-text border-2 block w-full font-bold m-1 hover:shadow clamp-1">
                        Đọc tiếp chapter: {manga.userData.readChapter.name}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <ChapterList id={`chapter-${manga.id}`} chapters={manga.chapters} mangaID={manga.id} />
            <div className="my-2">
              <CustomBanner url={'/quy-dinh'} image={'/img/quydinhyurineko.jpg'} />
            </div>
            <div className="mt-3 p-2">
              <h2 className="text-2xl text-pink font-semibold dark:text-dark-text">
                <i className="fas fa-comments"></i> Bình luận
              </h2>
              <Comment id={`comment-${manga.id}`} mangaID={id} chapterID={0} />
            </div>
          </div>
        </>
      )}
      <RowAds top={false} />
    </LayoutHome>
  )
}

const Page = manga

// Page.getInitialProps = async ({ req }) => {
//   try {
//     const banner = await getBanner('magnainfo')
//     return {
//       banner,
//     }
//   } catch {
//     return { banner: '' }
//   }
// }

export default Page
