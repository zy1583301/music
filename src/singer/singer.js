function getImgUrl (mid) {
  return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
}
export const setData = (list) => {
  // 先保存一下hot 我们让前20项作为最热
  let obj = {
    hot: {
      title: 'hot',
      items: []
    }
  }
  // 然后循环遍历list
  for (let i = 0; i < list.length; i++) {
    // 我们只需要里面的Fsinger_name,Fsinger_mid,Findex
    let { Fsinger_name, Fsinger_mid, Findex } = list[i]
    let nowItem = { Fsinger_name, Fsinger_mid, Findex }
    nowItem.avator = getImgUrl(Fsinger_mid)
    let index = nowItem.Findex
    // 前20项加入到hot这个成员的数组里
    if (i <= 19) {
      obj['hot'].items.push(nowItem)
    }
    // 然后判断 obj里面是否有这个成员0
    if (obj[index]) {
      obj[index].items.push(nowItem)
    } else {
      obj[index] = {
        title: index,
        items: []
      }
      obj[index].items.push(nowItem)
    }
  }
  // 准备两个数组给排一下续
  let hot = []
  let indexArr = []
  for (let key in obj) {
    if (key === 'hot') {
      hot.push(obj[key])
    } else {
      indexArr.push(obj[key])
    }
  }
  // 然后给 indexArr排序，根据 charCodeAt 来排序
  indexArr.sort((a, b) => {
    return a.title.charCodeAt() - b.title.charCodeAt()
  })
  return hot.concat(indexArr)
}
