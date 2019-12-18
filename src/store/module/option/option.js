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
      if (!b.length) {
        b.unshift(item.m)
      } else {
        for (let i = 0; i < len; i++) {
          let newMid = item.m.musicInfo.songmid
          let oldMid = b[i].musicInfo.songmid
          if (newMid === oldMid) {
            return false
          }
        }
        // item.m.playcode = item.code
        b.unshift(item.m)
      }
      // 也需要判断是否有这个成员 需要遍历
      localStorage.setItem('listen', JSON.stringify(b))
    }
  }
}
