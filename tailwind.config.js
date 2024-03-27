/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '50px'],
      '4xl': ['48px', '58px'],
      '8xl': ['96px', '106px']
    },
    extend: {
      screens: {
        'ipad-mini': '768px',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '0.5': '0.5px',
        '1.5': '1.5px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      colors: {
        'soft-gray': "rgba(216, 230, 239, 1)",
        'read-messages': "rgba(240, 238, 239, 0.8)",
        'border-messages': "rgba(128, 128, 128, 0.2)",
        'dark-basic': "#4e6e81",
        'soft-basic': "rgba(216, 230, 239, 1)",
        'white': "rgb(255 255 255)",
        'pop-up-bg': "rgba(216, 230, 239, 0.6)",
        'mobile-menu-bg': "rgb(181, 192, 208, 0.4)",
        'skills-list': "rgb(211,211,211, 0.5)",
        'input-field-border': "rgb(211,211,211)",
        'bookmark-saved-button': "#D24545"
      },
      boxShadow: {
        'box-shadow': '0 2px 5px 0px rgba(78, 110, 110, 0.3)',
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
      },
      transitionProperty: {
        'width': 'width'
      },
      gridTemplateColumns: {
        "grid-messages": 'repeat(3, minmax(0.2fr 1fr 0.2fr))',
      }
    },
  },
  plugins: [],
}

