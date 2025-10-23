/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'haunt-orange': '#FC7403',
        'haunt-red': '#a41214',
      },
      fontFamily: {
        'creepster': ['Creepster', 'cursive'],
        'goudymedieval': ['Goudymedieval', 'serif'],
        'nosifer': ['Nosifer', 'cursive'],
        'eater': ['Eater', 'Creepster', 'cursive'],
        'fell': ['IM Fell English', 'serif'],
      },
      screens: {
        'mobile-landscape': {'raw': '(max-width: 767px) and (orientation: landscape)'},
        'mobile-portrait': {'raw': '(max-width: 767px) and (orientation: portrait)'},
        'mobile-landscape-short': {'raw': '(max-width: 767px) and (max-height: 500px) and (orientation: landscape)'},
      },
    },
  },
  plugins: [],
}
