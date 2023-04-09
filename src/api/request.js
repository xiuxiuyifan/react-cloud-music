import request from "./config"

export const getBannerList = () => {
  return request.get('/banner')
}

export const getRecommendList = () => {
  return request.get('/personalized')
}

