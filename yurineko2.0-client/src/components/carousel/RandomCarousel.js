import MangaBoxSlide from '@/components/manga/MangaBoxSlide'
import { getR18Random, getRandomMangaList } from 'api/general'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Skeleton from 'react-loading-skeleton'

export default function RandomCarousel({ isR18 = false }) {
  var setting = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    lazyLoad: true,
    slidesToShow: 6,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
    ],
  }

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  useEffect(async () => {
    setIsLoading(true)
    if (isR18) {
      getR18Random()
        .then((res) => {
          setData(res)
          setIsLoading(false)
        })
        .catch((err) => err)
    } else {
      getRandomMangaList()
        .then((res) => {
          setData(res)
          setIsLoading(false)
        })
        .catch((err) => {})
    }
  }, [])
  return (
    <div className={`container mx-auto ${isLoading ? 'xl:px-40' : 'xl:px-slide'}`}>
      {isLoading == false ? (
        <Slider {...setting} className="mx-auto pr-1">
          {data.map((item) => (
            <MangaBoxSlide key={`random-${item.id}`} manga={item} />
          ))}
        </Slider>
      ) : (
        <Slider {...setting} className="mx-auto pr-1">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton
              key={`skeleton-${item}`}
              height={250}
              width="100%"
              style={{ margin: '0 10px' }}
            />
          ))}
        </Slider>
      )}
    </div>
  )
}
