
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