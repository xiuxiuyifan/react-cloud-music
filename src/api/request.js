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

export const getRankList = () => {
  return request.get(`/toplist/detail`)
}

export const getAlbumDetailRequest = (id) => {
  return request.get(`/playlist/detail?id=${id}`)
}

export const getSingerInfoRequest = (id) => {
  return request.get(`/artists`, {
    params: {
      id
    }
  })
}

export const getLyricRequest = (id) => {
  return request.get(`/lyric`, {
    params: {
      id
    }
  })
}
export const getHotKeyWordsRequest = () => {
  return request.get(`/search/hot`);
};

export const getSuggestListRequest = query => {
  return request.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = query => {
  return request.get(`/search?keywords=${query}`);
};

export const getSongDetailRequest = id => {
  return request.get(`/song/detail`, {
    params: {
      ids: id
    }
  })
}