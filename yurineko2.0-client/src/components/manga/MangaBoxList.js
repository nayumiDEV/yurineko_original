import React from 'react'
import Link from 'next/link'
import { TeamName, Description } from '../tag/Text'
import AuthorList from '../list/AuthorList'
import TagList from '../list/TagList'
import imgLink from '@/utils/imgLink'
import YuriTagList from '../list/YuriTagList'
import OriginList from '../list/OriginList'
import { linkParser, readLinkParser } from '@/utils/generateLink'
import parseListColor from '@/utils/parseListColor'
import parseListText from '@/utils/parseListText'

export default function MangaBoxList({ manga, list = null, type="manga" }) {
  return (
    <div className="h-full rounded dark:border-dark-white p-3 overflow-hidden flex dark:bg-dark-gray-light manga-list-box mb-2 mx-1 md:mx-0">
      <div className="w-1/4">
        <Link href={linkParser(type, manga.id)}>
          <div className="cursor-pointer overflow-hidden flex items-start justify-center w-full relative">
            <img
              className="min-w-full flex-shrink-0"
              src={imgLink(manga.thumbnail)}
              alt="thumbnail"
            />
            {manga.listKey && list == null && (
              <span
                className={`text-xs ${parseListColor(
                  manga.listKey
                )} text-white p-1 leading-none absolute top-0 left-0 rounded-md`}
              >
                {parseListText(manga.listKey)}
              </span>
            )}
          </div>
        </Link>
      </div>
      <div className="pl-2 w-3/4">
        <a target="_blank" rel="noreferrer" href={linkParser(type, manga.id)} >
          <p className="dark:text-dark-text hover:text-pink cursor-pointer manga-list-box__name">
            {manga.originalName}
          </p>
        </a>
        {manga.type == 2 && <OriginList origin={manga.origin} />}
        <div className="mt-2 p-2 dark:text-dark-gray dark:bg-dark-gray manga-list-box__group">
          <p>
            <AuthorList author={manga.author} color="#535c68" />
          </p>
          <p>
            <TeamName team={manga.team} color="#535c68" />
          </p>
          <div className="flex flex-wrap">
            <TagList tags={manga.tag} />
            {manga.type == 2 && <YuriTagList tags={manga.couple} />}
          </div>
          <div className="hidden md:block">
            <p style={{ color: '#535c68', fontSize: '1.1rem' }} className="dark:text-dark-text">
              Nội dung:
            </p>
            <p
              style={{ color: '#777', fontSize: '1.1rem' }}
              className={`font-normal clamp-2 dark:text-dark-text`}
              dangerouslySetInnerHTML={{ __html: manga.description }}
            />
          </div>
        </div>

        <div className="mt-2">
          {manga.lastChapter && (
            <a href={readLinkParser(type, { mangaID: manga.id, chapterID: manga.lastChapter.id })}>
              <p
                style={{ fontSize: '1.1rem' }}
                className="text-gray-dark font-light dark:text-dark-text cursor-pointer hover:text-pink clamp-22"
              >
                » {manga.lastChapter?.name ?? 'Last chapter'}
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
