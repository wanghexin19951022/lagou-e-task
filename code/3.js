const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

// 1、使用fp.add(x,y)和fp.map(fn,x)创建一个能让Functor里的值增加的函数ex1
let maybe = Maybe.of([5, 6, 11])
let ex1 = () => {
 return maybe.map( arr => fp.map(val => fp.add(val, 1), arr))
}
console.log(ex1())

// 2、实现一个函数ex2，能够使用fp.first获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
  return xs.map(arr => fp.first(arr))
}
console.log(ex2())

// 3、实现一个函数ex3,使用safeProp和fp.first找到user的名字的首字母
let safeProp = fp.curry(function (x, o){
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert'}
let ex3 = () => {
  return safeProp('name', user).map(res => fp.first(res))
}
console.log(ex3())


// 4、使用Maybe重写ex4，不要有if语句
// let ex4 = function (n) {
//   if (n) {
//     return parseInt(n)
//   }
// }

let ex4 = n => {
  let maybe = Maybe.of(n)
  return maybe.map((x) => {
    return parseInt(x)
  })
}
console.log(ex4('2'))