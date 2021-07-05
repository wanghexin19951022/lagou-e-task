// 代码题
// 一、将下面异步代码使用promise的方式改进
// setTimeout(() => {
//     var a = 'hello'
//     setTimeout(() => {
//       var b = 'lagou'
//       setTimeout(() => {
//         var c = 'I O U'
//         console.log(a + b + c)
//     }, 10);
//   }, 10);
// }, 10);

// 解题：声明一个promise 对象，然后.then()链式调用，依次把回调函数的结果传递给下一个promise对象
let promise = new Promise((resolve, reject) => {
  var a = 'hello'
  resolve(a)
})
promise.then(value => {
  return value
}).then((value) => {
  var b = 'lagou'
  return value + b
}).then((value) => {
  var c = 'I O U'
  console.log(value + c)
})