// user-frontend/postcss.config.js (The correct v4 configuration)

export default {
  plugins: {
    // FIX: Use the new dedicated PostCSS plugin package
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
}