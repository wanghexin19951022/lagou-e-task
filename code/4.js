const MyPromise = require('./myPromise')
// 1、没有异步的情况
// let mypromise = new MyPromise((resolve, reject) => {
//   resolve(1)
//   reject('2')
// })

// 2、添加上异步的情况
let mypromise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve('1')
    // }, 2000);
    resolve(1)
  // reject('2')
})

// 3、只有一个回调的情况
// mypromise.then(value => {
//   console.log(value)
// },reason => {
//   console.log(reason)
// })

// 4、多个回调的时候，同步不用管，添加上异步的处理
// mypromise.then(value => {
//   console.log(1)
// },reason => {
//   console.log('失败1')
// })
// mypromise.then(value => {
//   console.log(2)
// },reason => {
//   console.log('失败2')
// })

// 5、链式调用的时候，每一个成功回调的值都是上一个成功回调的返回值，每次then()方法调用的时候都需要返回一个Promise对象
// mypromise.then(value => {
//   console.log(value)
//   // return 10
//   return promiseObj()
// }).then(value =>{
//   console.log(value)
// })

// function promiseObj() {
//   return new MyPromise((resolve, reject) => {
//     resolve('对象')
//   })
// }
// 6、当then()方法返回Promise对象的时候，不能返回当前的Promise对象，这样就是循环调用了（TypeError: Chaning cycle detected for promise #<Promise>）
// let p = mypromise.then(value => {
//   console.log(value)
//   return p // 此处报错，返回了同一个promise对象
// })

// p.then(value => {
//   console.log(value)
// }, reason => {
//   // 上面报错，这块接收
//   console.log(reason)
// })

// 7、捕获异常
// mypromise.then(value => {
//   // throw new Error('executor error!') // 执行器抛异常
//   // resolve('1')
//   // reject('失败')
// })

// mypromise.then(value => {
//   // 这块回调的时候报错了，也要抛异常
//   throw new Error('then error!')
// }, reason => {
//   console.log(reason)
// }).then(value => {
//   console.log(value)
// }, reason => {
//   console.log(reason)
// })

// 8、then()方法的参数变成可选的参数 then()中的值可以一直向下传递
// value:1 reson:2
// mypromise.then().then().then(value => console.log(value), reason => console.log(reason))

// 9、添加promise.all()方法
function p1() {
  return new MyPromise(function (resolve, reject) {
    setTimeout(function() {
      resolve('p1')
    }, 1000)
  })
}
function p2() {
  return new MyPromise(function (resolve, reject) {
    // resolve('p2')
    reject('reject p2')  
  })
}
// all是静态方法，需要通过类名调用
// MyPromise.all(['a', 'b', p1(), p2()]).then(result => console.log(result))

// 10、Promise.resolve()是将给定的值转成promise对象
// MyPromise.resolve(10).then(value => console.log(value))
// MyPromise.resolve(p1()).then(value => console.log(value))

// 11、finally()：无论成功失败都会调用一次，不是静态方法

// p2().finally(() => {
//   console.log('fina')
//   // return p1()
// }).then(value => {
//   console.log(value)
// },reason => {
//   console.log(reason)
// })

// 12、catch

p2().then(value => console.log(value)).catch(reason => console.log(reason))