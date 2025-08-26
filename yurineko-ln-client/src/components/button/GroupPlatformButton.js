import React from 'react'

export default function GroupPlatformButton() {
  return (
    <div className="mx-auto container xl:px-40 py-2">
      <div className="flex flex-wrap -mx-2 overflow-hidden">
        <div className="my-2 px-2 w-1/2 overflow-hidden sm:w-1/2 md:w-1/4">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://yurineko.moe"
            style={{ fontFamily: "'Staatliches', cursive" }}
            className="flex items-center justify-center mx-2 bg-button-manga px-4 py-2 rounded-full font-normal md:text-2xl text-md text-white hover:text-white tracking-widest"
          >
            YURINEKO MANGA
          </a>
        </div>

        <div className="my-2 px-2 w-1/2 overflow-hidden sm:w-1/2 md:w-1/4">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://ln.yurineko.moe"
            style={{ fontFamily: "'Staatliches', cursive" }}
            className="flex items-center justify-center mx-2 bg-button-ln px-4 py-2 rounded-full font-normal md:text-2xl text-md text-white hover:text-white tracking-widest"
          >
            YURINEKO NOVEL
          </a>
        </div>

        {/* <div className="my-2 px-2 w-1/2 overflow-hidden sm:w-1/2 md:w-1/4">
          <a
            href="#"
            style={{ fontFamily: "'Staatliches', cursive" }}
            className="flex items-center justify-center mx-2 bg-button-bhtt px-4 py-2 rounded-full font-normal md:text-2xl text-md text-white hover:text-white tracking-widest relative overflow-hidden"
          >
            YURINEKO BHTT
            <span className="absolute bg-pink-700 transform -rotate-45 text-xs text-center py-0 px-4 w-32 -left-6">SẮP RA <br/> MẮT</span>
          </a>
        </div>

        <div className="my-2 px-2 w-1/2 overflow-hidden sm:w-1/2 md:w-1/4">
          <a
            href="#"
            style={{ fontFamily: "'Staatliches', cursive" }}
            className="flex items-center justify-center mx-2 bg-button-fiction px-4 py-2 rounded-full font-normal md:text-2xl text-md text-white hover:text-white tracking-widest relative overflow-hidden"
          >
            YURINEKO FICTION
            <span className="absolute bg-pink-700 transform -rotate-45 text-xs text-center py-0 px-4 w-32 -left-6">SẮP RA <br/> MẮT</span>
          </a>
        </div> */}
      </div>
    </div>
  )
}
