module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    'postcss-preset-env': {
      preserve: true // Сохраняет CSS-переменные
    }
  }
}
