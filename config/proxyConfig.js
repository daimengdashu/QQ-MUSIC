// const commonParams = {
//   g_tk: 5381,
//   format: 'jsonp',
//   inCharset: 'utf-8',
//   outCharset: 'utf-8',
//   notice: 0
// }

// const data = Object.assign({}, commonParams, {
//   songmid: '003OUlho2HcRHC',
//   pcachetime: +new Date(),
//   platform: 'yqq',
//   hostUin: 0,
//   uin: 0,
//   g_tk: 67232076,
//   format: 'json'
// })

module.exports = {
  proxy: {
    '/api/lyric': {
      target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
      changeOrigin: true,
      pathRewrite: {
        '^api/lyric': '/api/lyric'
      },
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      }
    }
  }
}
