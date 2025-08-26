import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="vi">
        <Head>
          <meta charSet="utf-8" />
          <meta name="application-name" content="Yurineko" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Yurineko" />
          <meta
            name="description"
            content="Thuần khiết • Dịu Dàng • Đáng yêu
Chào mừng đến với thiên đường Yuri
© Yunene/Project Yurineko"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="https://yurineko.moe/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://yurineko.moe/icons/icon-128.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://yurineko.moe/icons/icon-32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://yurineko.moe/icons/icon-16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="https://yurineko.moe/icons/icon-128.png" color="#5bbad5" />
          <link rel="shortcut icon" href="https://yurineko.moe/icons/icon-128.png" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
            rel="stylesheet"
          ></link>
          <meta name="theme-color"></meta>
          <meta name="twitter:card" content="Yurineko.net" />
          <meta name="twitter:url" content="https://yurineko.moe" />
          <meta name="twitter:title" content="Yurineko.net" />
          <meta
            name="twitter:description"
            content="Thuần khiết • Dịu Dàng • Đáng yêu
Chào mừng đến với thiên đường Yuri
© Yunene/Project Yurineko"
          />
          <meta name="twitter:image" content={process.env.BANNER_MANGA} />
          <meta name="twitter:creator" content="iHelloWorld.tech" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

          <meta
            property="og:description"
            content="Thuần khiết • Dịu Dàng • Đáng yêu
Chào mừng đến với thiên đường Yuri
© Yunene/Project Yurineko"
          />
          <meta property="og:site_name" content="Yurineko" />
          <meta property="og:url" content="https://yurineko.moe" />

          <meta
            name="description"
            content="Yurineko.net là một dự án xây dựng website dành riêng cho thể loại truyện Yuri, Bách Hợp."
          />
          <meta
            name="og:description"
            content="Yurineko.net là một dự án xây dựng website dành riêng cho thể loại truyện Yuri, Bách Hợp."
          />
          <meta
            name="keywords"
            content="manga, yurineko, yuri, truyen yuri, manga yuri, yurineko.moe, vietsub, truyen"
          />
          <meta name="revisit-after" content="5 days" />
          <meta name="author" content="iHelloWorld.tech" />
          <script src="/js/all.min.js" crossOrigin="anonymous"></script>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-0R4BT7KGMZ"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-0R4BT7KGMZ");
    `,
            }}
          ></script>

          <script
            async
            type="application/javascript"
            src="https://a.exdynsrv.com/ad-provider.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>

        <script src="/main.js" />
        <div id="fb-root"></div>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v9.0"
          nonce="Ge3W3rhb"
        ></script>
      </Html>
    )
  }
}

export default MyDocument
