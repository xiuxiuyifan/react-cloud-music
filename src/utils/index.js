
export const getCount = (count) => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 1000) < 10000) {
    return Math.floor(count / 1000) / 10 + "万"
  } else if (Math.floor(count / 10000000) / 10) {
    return Math.floor(count / 10000000) / 10 + "亿"
  }
}

// 添加防抖函数

export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    // 在新的一次触发的时候，如果发现上一次的定时器还在的话就将其清理掉。保证始终只能有最后一个定时器
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
    }, delay);
  }
}

// 处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
};

export const getName = list => {
  let str = "";
  list.map((item, index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};


// 判断一个对象是否为空

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0



// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;

let vendor = (() => {
  // 首先通过 transition 属性判断是何种浏览器
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransfrom",
    ms: "msTransform",
    standard: "Transform"
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export const getSongUrl = (id) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export const formatPlayTime = (interval) => {
  interval = interval | 0;
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2, "0")
  return `${minute}:${second}`
}

// 找到当前歌曲在歌曲列表中的索引位置
export const findIndex = (song, list) => {
  return list.findIndex(item => {
    return song.id === item.id
  })
}

// 每次随机一个位置，并与数组末尾的元素进行交换，然后缩小排序范围
export function shuffleArray(array) {
  let ret = [...array]
  for (let i = ret.length - 1; i > 0; i--) {
    // 随机一个位置
    let j = Math.floor(Math.random() * (i + 1));
    // 和元素末尾的交换位置
    [ret[i], ret[j]] = [ret[j], ret[i]]
  }
  return ret
}