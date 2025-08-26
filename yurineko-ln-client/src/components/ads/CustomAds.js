import React from 'react'

export default function CustomBanner({ url, image }) {
    return (
        <a target="_blank" rel="noreferrer" href={url}>
            <div className="w-full mx-auto flex items-center justify-center py-4">
                <img src={image}></img>
            </div>
        </a>
    )
}