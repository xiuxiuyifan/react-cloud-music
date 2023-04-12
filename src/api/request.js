import request from "./config"

export const getBannerList = () => {
  return request.get('/banner')
}

export const getRecommendList = () => {
  return request.get('/personalized')
}


export const getHotSingerList = (count) => {
  return request.get(`/top/artists`, {
    params: {
      offset: count
    }
  })
}

export const getSingerList = (category, alpha, count) => {
  return request.get(`/artist/list`, {
    params: {
      cat: category,
      initial: alpha.toLowerCase(),
      offset: count
    }
  })
}