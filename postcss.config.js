/**
 * PostCSS 配置。
 * Tailwind CSS v4 由 @tailwindcss/vite 插件处理，不在此重复配置 tailwindcss 插件，
 * 避免与 v3 的 postcss 用法混用；这里只负责浏览器前缀补全。
 */
export default {
  plugins: {
    autoprefixer: {},
  },
}
