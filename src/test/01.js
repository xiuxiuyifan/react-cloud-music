import { fromJS } from 'immutable'

// 创建一个 immutable 对象

let immutableState = fromJS({
  count: 0
})

// console.log(immutableState.get('count'))

// 不会改变原来的对象，会返回一个新的对象
let obj1 = immutableState.set('count', 100)
// console.log(obj1.get('count'))


let immutableObj = fromJS({
  a: 1
})

let immutableObj1 = immutableObj.merge({
  a: 2,
  b: 3
})

console.log(immutableObj1.toJS())