// 歌词解析插件，将歌词解析成 毫秒 ： 歌词 的形式，以方便后面使用

const timeExp = /\[(\d{2,}):(\d{2})\.(\d{2,3})?]/

const STATE_PAUSE = 0  // 暂停

const STATE_PLAYING = 1  // 正在播放

export default class Lyric {
  constructor(lrc, handler = () => { }) {
    this.lrc = lrc
    this.lines = []   // 这个存放解析后的数组
    this.handler = handler // 回调函数
    this.state = STATE_PAUSE  // 播放状态
    this.curLineIndex = 0  // 当前播放歌词所在的行数
    this.startStamp = 0;   // 歌曲开始的时间戳

    this._initLines()
  }

  // 格式化歌词信息
  _initLines() {
    // 解析代码
    const lines = this.lrc.split('\n')  // 按 \n 分隔成数组
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]   // 如 "[00:01.997] 作词：薛之谦"
      // 使用我们编写的正则进行匹配
      let result = timeExp.exec(line)
      if (!result) continue;
      const txt = line.replace(timeExp, '').trim() // 把时间戳去掉，只剩下歌词文本
      if (txt) {
        if (result[3].length === 3) {
          result[3] = result[3] / 10;//[00:01.997] 中匹配到的 997 就会被切成 99 , 相当于舍去个位数
        }
        this.lines.push({
          // 转换成毫秒
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
          txt
        })
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  // offset 为时间进度， isSeek 标志位表示用户是否手动调整进度
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING
    // 找到当前所在的行
    this.curLineIndex = this._findcurLineIndex(offset)
    // 把当前行传递给用户
    this._callHandler(this.curLineIndex - 1)
    // 根据时间进度判断歌曲开始的时间戳, 记录歌曲开始播放的时间戳
    this.startStamp = +new Date() - offset
    // 如果在歌词列表里面能找见
    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      // 继续播放
      this._playRest(isSeek)
    }
  }

  _callHandler(i) {
    if (i < 0) {
      return
    }
    // 将当前的行信息传递给用户
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  // 用传入的时间在歌词列表中进行查找
  _findcurLineIndex(time) {
    // 遍历歌词列表
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  /**
   * 
   * @param {表示用户是否手动调整进度} isSeek 
   */
  _playRest(isSeek = false) {
    // 根据索引取出 当前歌词行
    let line = this.lines[this.curLineIndex]
    let delay
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      // 拿到上一行歌词的开始时间，算间隔
      let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;
      delay = line.time - preTime
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++)
      if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }

  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop()
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset, true)
  }
}