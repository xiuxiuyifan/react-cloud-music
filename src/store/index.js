import { create } from "zustand";
import { getAlbumDetailRequest, getBannerList, getHotSingerList, getRankList, getRecommendList, getSingerInfoRequest, getSingerList } from "../api/request";
import { playMode } from "../api/static";


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
      // 设置播放列表
      playerPlayList: data.hotSongs
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
  playerPlayList: [
    {
      ftype: 0,
      djId: 0,
      a: null,
      cd: "01",
      crbt: null,
      no: 1,
      st: 0,
      rt: "",
      cf: "",
      alia: ["手游《梦幻花园》苏州园林版推广曲"],
      rtUrls: [],
      fee: 0,
      s_id: 0,
      copyright: 0,
      h: {
        br: 320000,
        fid: 0,
        size: 9400365,
        vd: -45814,
      },
      mv: 0,
      al: {
        id: 84991301,
        name: "拾梦纪",
        picUrl:
          "http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg",
        tns: [],
        pic_str: "109951164627180052",
        pic: 109951164627180050,
      },
      name: "拾梦纪",
      l: {
        br: 128000,
        fid: 0,
        size: 3760173,
        vd: -41672,
      },
      rtype: 0,
      m: {
        br: 192000,
        fid: 0,
        size: 5640237,
        vd: -43277,
      },
      cp: 1416668,
      mark: 0,
      rtUrl: null,
      mst: 9,
      dt: 234947,
      ar: [
        {
          id: 12084589,
          name: "妖扬",
          tns: [],
          alias: [],
        },
        {
          id: 12578371,
          name: "金天",
          tns: [],
          alias: [],
        },
      ],
      pop: 5,
      pst: 0,
      t: 0,
      v: 3,
      id: 1416767593,
      publishTime: 0,
      rurl: null,
    },
  ],   // 播放列表
  playerMode: playMode.sequence,  // 播放模式
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
  }
}))

export default useStore