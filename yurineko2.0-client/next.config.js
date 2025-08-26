const withPWA = require('next-pwa')
const withCSS = require('@zeit/next-css')

// module.exports = withCSS({
//   webpack: function (config) {
//     config.module.rules.push({
//       test: /\.(png|jpe?g|gif|webp)$/i,
//       use: [
//         {
//           loader: 'file-loader',
//           options: {
//             publicPath: '/_next',
//             name: 'static/media/[name].[hash].[ext]',
//           },
//         },
//       ],
//     })
//   },
// })

module.exports = withPWA({
  pwa: {
    dest: 'public',
    // disable: false,
    register: true,
    importScripts: ['/worker.js'],
  },
})

module.exports = {
  env: {
    BASE_API: 'https://api.yurineko.moe',
    BASE_API_COMMENT: 'https://comment.yurineko.moe',
    BASE_API_GATEWAY: 'https://gw-s1.yurineko.moe',
    // BASE_API: 'http://localhost:8080',
    BASE_HOST: 'https://yurineko.moe',
    BASE_STORAGE: 'https://storage.yurineko.moe',
    FB_APP: '621193061759525',
    BANNER_HOMEPAGE: 'https://storage.yurineko.moe/cover/homepage.jpeg',
    BANNER_R18: 'https://storage.yurineko.moe/cover/r18.jpeg',
    BANNER_MANGA: 'https://storage.yurineko.moe/cover/mangainfo.jpeg',
    BANNER_TEAM: 'https://storage.yurineko.moe/cover/team.jpeg',
    BANNER_PROFILE: 'https://storage.yurineko.moe/cover/profile.jpeg',
    CAPCHA_KEY: '6Lc1eXUqAAAAAGPQ21JXRGBa37vjW-ZaWFdkAjYh',
  },
}
