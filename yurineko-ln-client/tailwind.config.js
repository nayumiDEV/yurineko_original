module.exports = {
  future: {
    purgeLayersByDefault: true,
  },
  darkMode: 'class',
  purge: ['./src/components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      padding: {
        slide: `
         calc(10rem - 1rem)`,
      },
      boxShadow: {
        dark: '0 0 0 rgba(255, 255, 255, 1)',
      },
      colors: {
        pink: {
          lightness: '#fcd5da',
          light: '#a382f1',
          dark: '#a382f1',
          notif: '#f03f64',
          darkness: '#a382f1',
          DEFAULT: '#a382f1',
        },
        gray: {
          light: '#F3F3F3',
          dark: '#434343',
          darkness: '#3C3C3C',
          DEFAULT: '#9F9F9F',
          footer: '#535C68',
        },
        blue: {
          light: '#E7F3FF',
          dark: '#589BE0',
          darkness: '#3277B2',
          DEFAULT: '#4AD5F6',
        },
        green: {
          dark: '#59B259',
          DEFAULT: '#34FE57',
        },
        purple: {
          DEFAULT: '#a382f1',
        },
        tag: {
          team: '#f7479a',
          mention: '#4ed5f6',
          user: '#4ed5f6',
          premium: '#0ffc0f',
          uploader: '#F34DF4',
          admin: '#f7479a',

          DEFAULT: '#B7BFCA',
          dark: '#7d7b7b',
          hover: '#535C68',
          yuri: '#a382f1',
          'yuri-dark': '#a382f1',
        },
        dark: {
          DEFAULT: '#3C3C3C',
          black: '#000000',
          cyan: '#33303c',
          'dark-gray': "#242526",
          gray: '#383838',
          'gray-light': '#444444',
          'gray-comment': '#2b2b2b',
          text: '#FAFAFAFA !important',
          white: '#FFFFFF',
        },
        button: {
          active: '#ed145b',
          disable: '#a4a4a4',
          follow: '#59b259',
          done: '#3277b2',
          will: '#59bbd8',
          stop: '#d1504c',
          manga: "#f3808f",
          ln: "#a382f1",
          bhtt: "#f18f82",
          fiction: "#82b9f1"
          
        },
        read: {
          light: '#eae7f1',
          dark: '#242526',
        },
        notif: {
          read: "#444444",
          'read-dark': "#c7c7c7"
        }
      },
      maxWidth: {
        screen: '100vw',
      },
      minHeight: {
        xl: '700px',
      },
      fontSize: {
        md: '1.2rem',
        lg: '1.3rem',
      },
      zIndex: {
        top: 9999999,
        top1: 10000000,
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
      },
      height: {
        'img-sm': 220,
        'box-sm': 260,
        img: 240,
        box: 280,
      },
      minWidth: {
        '3/4': '75%',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover', 'focus'],
      textColor: ['visited'],
      backgroundColor: ['visited'],
      opacity: ['visited'],
      backgroundOpacity: ['visited'],
    },
  },
  plugins: [require('tailwindcss-line-clamp')],
}
