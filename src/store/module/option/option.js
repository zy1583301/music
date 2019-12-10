export default {
  namespaced: true,
  state: {
    flagCode: true
  },
  getters: {
  },
  mutations: {
    change (state) {
      state.flagCode = !state.flagCode
    },
    // 往历史去添加
    addHistory (state, item) {
      let a = localStorage.getItem('listen')
      let b = JSON.parse(a)
      let len = b.length
      // 也需要判断是否有这个成员 需要遍历
      for (let i = 0; i < len; i++) {
        let newMid = item.code === 'singer' ? item.m.musicData.songmid : item.m.songmid
        let oldMid = b[i].playcode === 'singer' ? b[i].musicData.songmid : b[i].songmid
        if (newMid === oldMid) {
          return false
        }
      }
      item.m.playcode = item.code
      b.unshift(item.m)
      localStorage.setItem('listen', JSON.stringify(b))
    }
  }
}
