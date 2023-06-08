import { create } from "zustand";
import {
  getAlbumDetailRequest,
  getBannerList,
  getHotKeyWordsRequest,
  getHotSingerList,
  getRankList,
  getRecommendList,
  getResultSongsListRequest,
  getSingerInfoRequest,
  getSingerList,
  getSongDetailRequest,
  getSuggestListRequest
} from "../api/request";
import { playMode } from "../api/static";
import { findIndex } from "../utils";


const useStore = create((set, get) => ({
  // 定义 banner 数据
  bannerList: [],
  initBannerList: async () => {
    const data = await getBannerList()
    set({ bannerList: data.banners })
  },
  // 定义 recommend 数据
  recommendList: [],
  initRecommendList: async () => {
    set({
      recommendLoading: true
    })
    const data = await getRecommendList()
    set({
      recommendList: data.result,
      recommendLoading: false
    })
  },
  recommendLoading: false,

  // singers 页面的数据
  singerList: [],
  singerEnterLoading: false,
  singerSetEnterLoading: (loading) => {
    set({ singerSetEnterLoading: loading })
  },
  singerPullUpLoading: false,
  singerSetPullUploading: (loading) => {
    set({ singerPullUpLoading: loading })
  },
  singerPullDownLoading: false,
  singerSetPullDownLoading: (loading) => {
    set({ singerPullDownLoading: loading })
  },
  singerPageCount: 0,
  singerSetPageCount: (count) => {
    set({ singerPageCount: count })
  },
  // 热门歌手列表  下拉
  singerSetSingerHotList: async (count) => {
    set({
      singerPullDownLoading: true,
      singerPageCount: 0
    })
    const data = await getHotSingerList(count)
    set({
      singerList: data.artists,
      singerPullDownLoading: false
    })
  },
  // 根据类型和 字母顺序获取 下拉
  singerSetCategoryOrAlphaSingerList: async (category, alpha) => {
    set({
      singerPullDownLoading: true,
      singerPageCount: 0
    })
    const data = await getSingerList(category, alpha, 0)
    set({
      singerList: data.artists,
      singerPullDownLoading: false
    })
  },
  // 上拉 加载热门歌手
  singerSetSingerHotListPullUp: async () => {
    const count = get().singerPageCount
    set({
      singerPullUpLoading: true,
      singerPageCount: count
    })
    const data = await getHotSingerList(count)
    set((state) => ({
      singerList: [...state.singerList, ...data.artists],
      singerPullUpLoading: false
    }))
  },
  // 上拉加载 分类歌手和字母歌手
  singerSetCategoryOrAlphaSingerListPullUp: async (category, alpha) => {
    set((state) => ({
      singerPullUpLoading: true
    }))
    const count = get().singerPageCount
    const data = await getSingerList(category, alpha, count)
    set((state) => ({
      singerList: [...state.singerList, ...data.artists],
      singerPullUpLoading: false
    }))
  },

  // rankList 页面数据
  rankList: [],
  rankLoading: false,
  rankSetRankList: async () => {
    set({
      rankLoading: true
    })
    let data = await getRankList()
    set({
      rankList: data.list,
      rankLoading: false
    })
  },
  rankCurrentAlbum: [],
  rankCurrentAlbumLoading: false,
  rankSetCurrentAlbum: async (id) => {
    set({
      rankCurrentAlbumLoading: true
    })
    let data = await getAlbumDetailRequest(id)
    set({
      rankCurrentAlbumLoading: false,
      rankCurrentAlbum: data.playlist
    })
  },

  // 歌手详情
  artistsList: [],
  artistsSongOfArtists: [],
  artistsSetList: async (id) => {
    set({
      artistsLoading: true
    })
    let data = await getSingerInfoRequest(id)
    set({
      artistsLoading: false,
      artistsList: data.artist,
      artistsSongOfArtists: data.hotSongs,
    })
  },
  artistsLoading: false,


  // 播放器
  playerFullScreen: false,  // 播放器是否全屏模式
  playerSetFullScreen: (visible) => {
    set({ playerFullScreen: visible })
  },
  playerPlaying: false,      // 当前歌曲是否播放
  playerSetPlaying: (playing) => {
    set({
      playerPlaying: playing
    })
  },
  playerSequencePlayList: [], // 顺序列表(之后会有随机模式，列表会乱序，从这个列表拿回保存顺序)
  playerSetSequencePlayList: (sequenceList) => {
    set({
      playerSequencePlayList: sequenceList
    })
  },
  playerPlayList: [],   // 播放列表
  playerSetPlayList: (list) => {
    set({
      playerPlayList: list
    })
  },
  playerMode: playMode.sequence,  // 播放模式
  playerSetMode: (mode) => {
    set({
      playerMode: mode
    })
  },
  playerCurrentIndex: -1, // 当前歌曲正在播放列表的索引
  playerSetCurrentIndex: (index) => {
    set({
      playerCurrentIndex: index
    })
  },
  playerShowPlayList: [], // 是否展示播放列表
  playerCurrentSong: {},   // 当前正在播放音乐的信息
  playerSetCurrentSong: (song) => {
    set({
      playerCurrentSong: song
    })
  },
  // 删除歌曲
  playerDeleteSong: (song) => {
    let { playerPlayList, playerSequencePlayList, playerCurrentIndex } = get()
    // 找到当前正在播放的列表中的歌曲将其删掉
    let fpIndex = findIndex(song, playerPlayList)
    playerPlayList.splice(fpIndex, 1)

    // 在顺序列表中的话，直接将其删掉
    const fsIndex = findIndex(song, playerSequencePlayList)
    playerSequencePlayList.splice(fsIndex, 1)
    set({
      playerPlayList,
      playerSequencePlayList,
      playerCurrentIndex
    })
  },
  // 清空播放列表
  playerClear: () => {
    set({
      playerPlayList: [],  // 清空正在播放的列表
      playerSequencePlayList: [], // 清空顺序播放的列表
      playerCurrentIndex: -1,  // 重置当前正在播放的索引
      playListVisible: false, // 关闭 playList 的显示
      playerCurrentSong: {},  // 把当前正在播放的歌曲置空
      playerPlaying: false   // 重置当前播放状态
    })
  },

  // 播放列表
  playListVisible: false,
  playListSetVisible: (visible) => {
    set({
      playListVisible: visible
    })
  },

  // 搜索页面
  searchHotList: [], // 热门搜索关键词
  searchSetHotList: () => {
    getHotKeyWordsRequest()
      .then((res) => {
        set({
          searchHotList: res.result.hots
        })
      })
  },
  searchSuggestList: [], // 列表，包括歌单和歌手
  searchSetSuggestList: (q) => {
    if (!q) {
      set({
        searchSuggestList: [],
        searchSongsList: []
      })
      return
    } else {
      if (!/[\u4e00-\u9fa5]/.test(q)) {
        return
      }
      // 获取相关专辑和相关歌手
      getSuggestListRequest(q)
        .then((res) => {
          set({
            searchSuggestList: res.result
          })
        })
      // 获取相关歌曲数据
      getResultSongsListRequest(q)
        .then((res) => {
          set({
            searchSongsList: res.result.songs
          })
        })
    }
  },
  searchSongsList: [],  // 歌曲列表
  // 把搜索到的歌曲列表中的数据插入到歌曲列表里面
  searchInsertSong: (id) => {
    // 获取单曲歌曲详情
    getSongDetailRequest(id)
      .then((res) => {
        let song = res.songs[0]
        handleInsertSong(get, set, song)
      })
  }
}))

export default useStore

function handleInsertSong(get, set, song) {
  let {
    playerPlayList,
    playerSequencePlayList,
    playerCurrentIndex
  } = get()
  // 先看一下当前歌曲在不在当前的播放列表里面
  let fpIndex = findIndex(song, playerPlayList)
  // 说明当前播放的就是当前歌曲，则什么都不做，直接返回
  if (fpIndex === playerCurrentIndex && fpIndex !== -1) {
    return
  }
  // 当前歌曲不在播放列表里面的时候，放到当前播放歌曲的下一个位置，并立刻播放下一首歌曲
  playerCurrentIndex++
  // 起始的索引，要删除 0 个，就是插入
  playerPlayList.splice(playerCurrentIndex, 0, song)


  // 如果当前歌曲本身就在播放列表里面的话
  if (fpIndex > -1) {
    // 如果 点击的歌曲在当前播放的索引小于当前正在播放的索引，则删除它 索引减一
    if (playerCurrentIndex > fpIndex) {
      playerPlayList.splice(fpIndex, 1)
      playerCurrentIndex--
    } else {
      // 在当前播放列表的后面的话，则直接删除
      playerPlayList.splice(fpIndex, 1)
    }
  }

  // 相同的逻辑处理顺序播放列表
  // 取出 点击歌曲在 顺序列表中的索引
  let fsIndex = findIndex(song, playerSequencePlayList);
  // 当前播放歌曲在 原始序列歌曲列表中的索引
  let sequenceIndex = findIndex(playerPlayList[playerCurrentIndex], playerSequencePlayList)
  if (fsIndex > -1) {
    if (sequenceIndex > fsIndex) {
      playerSequencePlayList.splice(fsIndex, 1)
      sequenceIndex--
    } else {
      playerSequencePlayList.splice(fsIndex, 1)
    }
  }

  set({
    playerCurrentIndex,
    playerPlayList,
    playerSequencePlayList
  })

}