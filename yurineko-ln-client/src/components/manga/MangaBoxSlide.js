import React from 'react'
import styles from '../../../styles/MangaBox.module.css'
import Link from 'next/link'
import imgLink from '@/utils/imgLink'
import { lightnovelLink } from '@/utils/generateLink'

export default function MangaBoxSlide({ manga }) {
  return (
    <div
      className={`cursor-pointer flex relative justify-center items-center bg-red mx-auto w-5/6 rounded border-solid border border-pink-light dark:border-dark-white ${styles.mangaBox}`}
    >
      <Link href={lightnovelLink(manga.id)}>
        <img
          src={imgLink(manga.thumbnail)}
          alt="thumbnail"
          className=" block flex-shrink-0 min-w-full min-h-full"
        />
      </Link>

      <div className="absolute bg-opacity-80 w-full min-h-12 p-1 bg-white dark:bg-dark-black dark:bg-opacity-60 flex justify-around flex-col">
        <a target="_blank" href={lightnovelLink(manga.id)} rel="noreferrer">
          <p className="dark:text-dark-text font-semibold text-xl opacity-90 clamp-2">
            {manga.originalName}
          </p>
        </a>
        <a target="_blank" href={lightnovelLink(manga.id)} rel="noreferrer">
          <p className="dark:text-dark-text font-semibold leading-4 text-sm opacity-80">
            {manga.lastChapter?.name ?? ''}
          </p>
        </a>
      </div>
    </div>
  )
}
