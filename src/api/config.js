import axios from "axios";


export const baseUrl = `${location.protocol}//${location.hostname}:3001`


// 创建 axios 实例

const request = axios.create({
  baseURL: baseUrl
})

request.interceptors.response.use((res) => {
  return res.data
}, (err) => {
  console.log(err, '网络错误！')
})

export default request