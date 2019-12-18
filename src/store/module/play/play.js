
import Axios from 'axios'
let store = {
  namespaced: true,
  state: {
    songList: [], // 播放列表
    currentIndex: -1, // 当前播放的索引值
    loopState: 0, // 0 为顺序播放，1为单曲循环，2为随机播放
    fullScreen: true, // 默认为true，全屏，false为小屏
    num: 0,
    timer: null,
    singleNum: -1,
    item: false,
    songUrl: '',
    imgUrl: '',
    playCode: 'singer',
    mid: '',
    a: '',
    isVip: false,
    canplay: [],
    showLoading: false,
    searchList: []
  },
  getters: {
    // 计算出当前播放歌曲所需songmid
    getSongmid (state) {
      return state.songList[state.currentIndex].musicInfo.songmid
    },
    returnMid (state) {
      return state.songList[state.currentIndex].musicInfo.albummid
    },
    returnSingerName (state) {
      let arr = state.songList[state.currentIndex].musicInfo.singer
      let name = ''
      let nameArr = arr.map(item => {
        return item.name
      })
      name = nameArr.join('、')
      return name
    },
    returnSongName (state) {
      return state.songList[state.currentIndex].musicInfo.songname
    },
    returnSongList (state) {
      return state.songList[state.currentIndex] || {}
    },
    returnSongArr (state) {
      return state.canplay
    },
    returnSearchList (state) {
      return state.searchList
    },
    returnUrl (state) {
      return state.imgUrl
    },
    returnTips (state) {
      return state.isVip
    },
    returnFullScreen (state) {
      return state.fullScreen
    }
  },
  mutations: {
    // 对列表进行数据替换
    createSongList (state, params) {
      state.songList = params
    },
    addSongList (state, params) {
      let flag = state.songList.some(item => {
        return item.songUrl === params.songUrl
      })
      if (flag) return
      state.songList.push(params)
    },
    returnImgUrl (state, params) {
      state.imgUrl = params
    },
    // 播放选中歌曲 将索引值替换
    setCurrentIndex (state, params) {
      state.currentIndex = params
      state.singleNum = params
      state.item = !state.item
    },
    // 对当前播放索引值进行替换
    changeCurrentIndex (state, params) {
      // 需要判断 穿过来的的是 上一曲还是 下一曲
      switch (params) {
        case 'next':
          if (state.currentIndex < state.songList.length - 1) {
            if (state.loopState === 0) {
              state.currentIndex++
            } else if (state.loopState === 1) {
              state.currentIndex++
              state.singleNum = state.currentIndex
            } else {
              state.currentIndex = Math.floor(Math.random() * state.songList.length)
            }
          } else {
            if (state.loopState === 0) {
              state.currentIndex = 0
            } else if (state.loopState === 1) {
              state.currentIndex = 0
            } else {
              state.currentIndex = Math.floor(Math.random() * state.songList.length)
            }
          }
          break
        case 'prev':
          if (state.currentIndex === 0) {
            if (state.loopState === 0) {
              state.currentIndex = state.songList.length - 1
            } else if (state.loopState === 1) {
              state.currentIndex = state.songList.length - 1
            } else {
              state.currentIndex = Math.floor(Math.random() * state.songList.length)
            }
          } else {
            if (state.loopState === 0) {
              state.currentIndex--
            } else if (state.loopState === 1) {
              state.currentIndex--
            } else {
              state.currentIndex = Math.floor(Math.random() * state.songList.length)
            }
          }
          break
        default:
          break
      }
    },
    changeShowLoading (state, flag) {
      store.state.showLoading = flag
    },
    single (state) {
      // console.log('单曲循环触发')
      // 触发这个函数 那么就让index一直等于进来时的索引
      state.currentIndex = state.singleNum
      // state.currentIndex = 1
    },
    // 改变全屏状态
    changeFullScreen (state, flag) {
      state.fullScreen = flag
    },
    // 改变循环模式
    changeModel (state) {
      state.loopState++
      if (state.loopState > 2) {
        state.loopState = 0
      }
    },
    changePlayModel (state, model) {
      state.loopState = model
    },
    changeCanplay (state, params) {
      state.canplay = params
    },
    handleInfo (state, params) {
      let { songArr, result } = params
      let arr = songArr.map((item, index) => {
        let songUrl = result[index].purl
        return {
          musicInfo: item,
          songUrl: songUrl
        }
      })
      let arr1 = arr.filter((item) => {
        return item.songUrl !== ''
      })
      store.state.canplay = arr1
      store.mutations.changeShowLoading('', false)
    },
    handleSearchInfo (state, params) {
      let { songArr, result } = params
      let arr = songArr.map((item, index) => {
        let songUrl = result[index].purl
        return {
          musicInfo: item,
          songUrl: songUrl
        }
      })
      let arr1 = arr.filter((item) => {
        return item.songUrl !== ''
      })
      let arr2 = store.state.searchList
      store.state.searchList = arr2.concat(arr1)
      store.state.canplay = arr1
    }
  },
  actions: {
    getUrl ({ commit }, songArr) {
      let songmidArr = songArr.map((item) => {
        return item.songmid
      })
      let songtype = Array.from({ length: songmidArr.length }, () => 0)
      let url = `http://${process.env.VUE_APP_API_URL}/item/songUrl?songmid=${JSON.stringify(songmidArr)}&songtype=${JSON.stringify(songtype)}`
      Axios.get(url).then(res => {
        handleMyState(res, songmidArr, songtype, songArr)
      })
    },
    getSearchUrl ({ commit }, songArr) {
      let songmidArr = songArr.map((item) => {
        return item.songmid
      })
      let songtype = Array.from({ length: songmidArr.length }, () => 0)
      let url = `http://${process.env.VUE_APP_API_URL}/item/songUrl?songmid=${JSON.stringify(songmidArr)}&songtype=${JSON.stringify(songtype)}`
      Axios.get(url).then(res => {
        handleMySearch(res, songmidArr, songtype, songArr)
      })
    }
  } }
export default store
function handleMyState (res, songmidArr, songtype, songArr) {
  let arr = res.data.req_0.data.midurlinfo
  let flag = isEmpty(arr)
  if (!flag) {
    store.mutations.handleInfo('handleInfo', { songmidArr: songmidArr, result: res.data.req_0.data.midurlinfo, songArr: songArr })
  } else {
    getMusicInfo(songmidArr, songtype).then((res) => {
      handleMyState(res, songmidArr, songtype, songArr)
    })
  }
}
function handleMySearch (res, songmidArr, songtype, songArr) {
  let arr = res.data.req_0.data.midurlinfo
  let flag = isEmpty(arr)
  if (!flag) {
    store.mutations.handleSearchInfo('handleSearchInfo', { songmidArr: songmidArr, result: res.data.req_0.data.midurlinfo, songArr: songArr })
  } else {
    getMusicInfo(songmidArr, songtype).then((res) => {
      handleMySearch(res, songmidArr, songtype, songArr)
    })
  }
}
function getMusicInfo (songmidArr, songtype) {
  let url = `http://${process.env.VUE_APP_API_URL}/item/songUrl?songmid=${JSON.stringify(songmidArr)}&songtype=${JSON.stringify(songtype)}`
  return Axios.get(url)
}
function isEmpty (arr) {
  return arr.every((item) => {
    return item.purl === ''
  })
}
