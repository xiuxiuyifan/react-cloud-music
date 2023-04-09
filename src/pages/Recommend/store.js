import { create } from "zustand";
import { getBannerList, getRecommendList } from "../../api/request";


const useRecommendStore = create((set) => ({
  // 定义 banner 数据
  bannerList: [],
  initBannerList: async () => {
    const data = await getBannerList()
    set({ bannerList: data.banners })
  },
  // 定义 recommend 数据
  recommendList: [],
  initRecommendList: async () => {
    const data = await getRecommendList()
    set({ recommendList: data.result })
  }
}))

export default useRecommendStore