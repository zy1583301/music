
import Axios from 'axios'
export default {
  namespaced: true,
  state: {
    songList: [], // 播放列表
    currentIndex: -1, // 当前播放的索引值
    loopState: 0, // 0 为顺序播放，1为单曲循环，2为随机播放
    fullScreen: true, // 默认为true，全屏，false为小屏
    num: 0,
    timer: null,
    rotateInfo: 'rotate(0deg)',
    singleNum: -1,
    item: false,
    songUrl: '',
    imgUrl: '',
    playCode: 'singer',
    mid: '',
    a: '',
    path: 'localhost' // '47.93.184.51'
  },
  getters: {
    // 计算出当前播放歌曲所需songmid
    getSongmid (state) {
      if (state.playCode === 'singer') {
        return state.songList[state.currentIndex].musicData.songmid
      } else {
        return state.songList[state.currentIndex].songmid
      }
    },
    returnMid (state) {
      if (state.songList[state.currentIndex].musicData) {
        return state.songList[state.currentIndex].musicData.albummid
      } else {
        return state.songList[state.currentIndex].albummid
      }
    },
    returnSingerName (state) {
      if (state.songList[state.currentIndex].musicData) {
        return state.songList[state.currentIndex].musicData.singer[0].name
      } else {
        return state.songList[state.currentIndex].singer[0].name
      }
    },
    returnSongName (state) {
      if (state.songList[state.currentIndex].musicData) {
        return state.songList[state.currentIndex].musicData.songname
      } else {
        return state.songList[state.currentIndex].songname
      }
    },
    returnSongList (state) {
      return state.songList[state.currentIndex] || {}
    },
    returnUrl (state) {
      return state.imgUrl
    }
  },
  mutations: {
    // 对列表进行数据替换
    createSongList (state, params) {
      state.songList = params
      //    console.log(this)
    },
    returnImgUrl (state, params) {
      state.imgUrl = params
    },
    // createPlay (state, params) {
    //   state.playCode = params
    // },
    // 播放选中歌曲 将索引值替换
    setCurrentIndex (state, params) {
      // console.log(this)
      state.currentIndex = params
      state.singleNum = params
      state.item = !state.item
      // console.log(state.singleNum,state.currentIndex)
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
    single (state) {
      // console.log('单曲循环触发')
      // 触发这个函数 那么就让index一直等于进来时的索引
      state.currentIndex = state.singleNum
      // state.currentIndex = 1
    },
    // 改变全屏状态
    changeFullScreen (state) {
      // console.log(this)
      state.fullScreen = !state.fullScreen
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
    }
  },
  actions: {
    getUrl (context, songmid) {
      let url = `http://${context.state.path}:4000/item/songUrl?songmid=${songmid}`
      Axios.get(url).then(res => {
        context.state.songUrl = `http://ws.stream.qqmusic.qq.com/${res.data.req_0.data.midurlinfo[0].purl}`
      })
    }
  }
}
