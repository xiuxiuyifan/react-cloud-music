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
    // 找到当前所在的杭
    this.curLineIndex = this._findcurLineIndex(offset)
    // 把当前行传递给用户
    this._callHandler(this.curLineIndex - 1)
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
}