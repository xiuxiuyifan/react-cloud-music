import { create } from "zustand";
import { getAlbumDetailRequest, getBannerList, getHotSingerList, getRankList, getRecommendList, getSingerList } from "../api/request";


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
}))

export default useStore