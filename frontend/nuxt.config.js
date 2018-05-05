module.exports = {
  // mode: 'spa', //single page application,本来是全部进行ssr，如果加上就全部取消ssr
  /*
  ** Headers of the page
  */
  head: {
    title: 'nodechat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // 添加插件iview
  plugins: [
    {src: '~plugins/iview', ssr: true},
    {src: '~plugins/emoji', ssr: false}
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' }
  /*
  ** Build configuration
  */
  // 注销ESlint
  // build: {
  //   /*
  //   ** Run ESLint on save
  //   */
  //   extend (config, ctx) {
  //     if (ctx.dev && ctx.isClient) {
  //       config.module.rules.push({
  //         enforce: 'pre',
  //         test: /\.(js|vue)$/,
  //         loader: 'eslint-loader',
  //         exclude: /(node_modules)/
  //       })
  //     }
  //   }
  // }
}
