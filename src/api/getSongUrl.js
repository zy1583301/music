// export const getSongUrl = (mid) => {
//   let songMid = mid || '000bzSQE1IZOXJ'
//   return ` http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${songMid}.m4a?guid=6488678118&vkey=E8D4B31D6CD6AD77536009069E8145193EB57809A812EB4220BB95DB0C27AF1C44C5DC989DC456696B3E5A51255C60FE0BA8449CC3FF1167&uin=0&fromtag=38`
// }
export const getLyricUrl = (mid) => {
  let songMid = mid || '000bzSQE1IZOXJ'
  // return `/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${songMid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1569567498308`
  return `/hehe/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${songMid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1569567498308`
}
