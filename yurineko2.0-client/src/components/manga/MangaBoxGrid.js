import React, { Component } from 'react'
import Link from 'next/link'
import imgLink from '@/utils/imgLink'
import { timeFromNow } from '@/utils/timeUpdate'
import { linkParser, readLinkParser } from '@/utils/generateLink'
import parseListText from '@/utils/parseListText'
import parseListColor from '@/utils/parseListColor'
export default function MangaBoxGrid({ manga, list = null, type="manga" }) {
  return (
    <Link href={linkParser(type, manga.id)}>
      <div className="mx-auto h-box-sm md:h-box mangaBoxfull relative flex flex-col cursor-pointer group">
        <span className="text-xs bg-blue text-white p-1 leading-none absolute top-0 left-0 rounded-md">
          {timeFromNow(manga.lastUpdate)}
        </span>
        {manga.type == 2 && (
          <span className="text-xs bg-pink-light text-white p-1 leading-none absolute top-6 left-0 rounded-md">
            Doujin
          </span>
        )}
        {manga.listKey && list == null && (
          <span
            className={`text-xs ${parseListColor(
              manga.listKey
            )} text-white p-1 leading-none absolute ${manga.type == 2 ? 'top-12' : 'top-6'
              } left-0 rounded-md`}
          >
            {parseListText(manga.listKey)}
          </span>
        )}
        <img
          className="w-full h-img-sm md:h-img shadow rounded border m-auto block"
          src={imgLink(manga.thumbnail)}
          alt="thumbnail"
        />
        <div>
          <p className="text-xl font-semibold text-gray dark:text-dark-text clamp-1 text-center group-hover:text-pink">
            {manga.originalName}
          </p>
          {manga.lastChapter && (
            <Link href={readLinkParser(type, { mangaID: manga.id, chapterID: manga.lastChapter.id })}>
              <p className="text-base text-gray dark:text-dark-text clamp-1 hover:text-blue">
                » {manga.lastChapter?.name ?? 'Last chapter'}
              </p>
            </Link>
          )}
        </div>
      </div>
    </Link>
  )
}
