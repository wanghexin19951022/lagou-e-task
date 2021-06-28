// 手写实现Promise
/*
  1、Promise是一个类，执行这个类时，需要传递一个执行器进去，且执行器会立即执行
  2、Promise有三种状态 分别为成功（fulfilled）、失败(rejected)、等待(pending)
  pending => fulfilled
  pending => rejected
  一旦状态确定就不可更改
  3、resolve 和 reject 函数就是用来更改状态的
      resolve 是把状态变成成功（fulfilled）
      reject 是把状态变成失败(rejected)
  4、then()方法内部做的事情就是判断状态，如果成功，调用成功的回调函数；如果失败，调用失败的回调
  5、then()成功回调有一个参数，是成功的值，失败的话，这个值是失败的原因
*/
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  // 首先传入一个执行器，这个执行器是一个立即执行的函数,它接收两个回调，成功的resolve，失败的rejected
  constructor(executor) {
    // try catch 捕获执行器的错误
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(e)
    }
  }
  // 默认是等待状态
  status = PENDING

  // 需要存储成功和失败的值，通过回调传递出去
  value = undefined
  reason = undefined

  // 存储成功和失败的回调
  successCallBack = []
  failCallBack = []

  // resolve和reject这里写成箭头函数，是因为当被调用时，不用考虑this指向问题，直接是当前的promise对象
  // 如果写成function定义的普通函数，this指向就不确定了，可能是window也可能是undifined
  // 在resolve中处理成功的操作
  resolve = (value) => {
    // 修改状态之前需要判断当前状态是否为等待
    if (this.status !== PENDING) return
    // 把等待状态置为成功
    this.status = FULFILLED

    this.value = value

    // 判断存储的回调是否存在,存在的话出发回调
    // this.successCallBack && this.successCallBack(this.value)

    // 当回调是多个的时候，在回调数组中处理多个回调
    while(this.successCallBack.length) {
      // shift()方法的返回值就是我们需要的回调函数
      this.successCallBack.shift()()
    }
  }
  // 在reject中处理失败的操作
  reject = (reason) => {
    if (this.status !== PENDING) return
    // 把等待状态置为失败
    this.status = REJECTED

    this.reason = reason

    // 1、判断失败的回调是否存在
    // this.failCallBack && this.failCallBack(this.reason)

    // 2、当回调是多个的时候，在回调数组中处理多个回调
    while(this.failCallBack.length) {
      // shift()方法的返回值就是我们需要的回调函数
      this.failCallBack.shift()()
    }
  }

  // then 方法
  then(successCallBack, failCallBack) {
    successCallBack = successCallBack ?  successCallBack: value => value
    failCallBack = failCallBack ?  failCallBack: reason => {throw reason}
    // 为了每次调用then()方法都返回一个MyPromise对象，那么创建一个新的MyPromise对象
    // 由于MyPromise对象接收的执行器是立即执行的，并且下面的代码也是立即执行的，可以改造如下
    let promise2 = new MyPromise((resolve, reject) =>{
      if (this.status === FULFILLED) {
        setTimeout(() => {
          // 捕获then回调的异常
          try {
              // 成功回调
            // successCallBack(this.value)
            let n = successCallBack(this.value)
            /* 判断 n 这个值是Promise对象还是普通数值
              如果是普通数值，直接调用resolve去出发里面的回调并传值
              如果是Promise对象，判断Promise的结果，再看是调用resolve还是reject
            */
            // resolve(n)
            resolvePromise(n, resolve, reject, promise2)
            // 这里的promise2目前接收不到，需要等回调执行完才可以，所以，setTimeout把代码变成异步
          } catch (error) {
              reject(error)
          }   
        }, 0);
        
      } else if (this.status === REJECTED) {
        // 失败回调
        // failCallBack(this.reason)
        setTimeout(() => {
          // 捕获then回调的异常
          try {
              // 失败回调
            // failCallBack(this.reason)
            let n = failCallBack(this.reason)
            /* 判断 n 这个值是Promise对象还是普通数值
              如果是普通数值，直接调用resolve去出发里面的回调并传值
              如果是Promise对象，判断Promise的结果，再看是调用resolve还是reject
            */
            // resolve(n)
            resolvePromise(n, resolve, reject, promise2)
            // 这里的promise2目前接收不到，需要等回调执行完才可以，所以，setTimeout把代码变成异步
          } catch (error) {
              reject(error)
          }   
        }, 0);
      } else {
        // 等待状态的时候
        // 如果回调的时候有异步操作，那么调then()方法的时候不知道去调用哪个
        // this.successCallBack = successCallBack
        // this.failCallBack = failCallBack
        //   ↓
        // this.successCallBack.push(successCallBack)
        // this.failCallBack.push(failCallBack)
        //   ↓
        // 为了可以处理异步时，下面的处理在reject 和 resolve中就不要在回调中传值了
        this.successCallBack.push(() => {
          // successCallBack()
          setTimeout(() => {
            // 捕获then回调的异常
            try {
                // 成功回调
              // successCallBack(this.value)
              let n = successCallBack(this.value)
              /* 判断 n 这个值是Promise对象还是普通数值
                如果是普通数值，直接调用resolve去出发里面的回调并传值
                如果是Promise对象，判断Promise的结果，再看是调用resolve还是reject
              */
              // resolve(n)
              resolvePromise(n, resolve, reject, promise2)
              // 这里的promise2目前接收不到，需要等回调执行完才可以，所以，setTimeout把代码变成异步
            } catch (error) {
                reject(error)
            }   
          }, 0);
        })
        this.failCallBack.push(() => {
          // failCallBack()
          setTimeout(() => {
            // 捕获then回调的异常
            try {
                // 失败回调
              // failCallBack(this.reason)
              let n = failCallBack(this.reason)
              /* 判断 n 这个值是Promise对象还是普通数值
                如果是普通数值，直接调用resolve去出发里面的回调并传值
                如果是Promise对象，判断Promise的结果，再看是调用resolve还是reject
              */
              // resolve(n)
              resolvePromise(n, resolve, reject, promise2)
              // 这里的promise2目前接收不到，需要等回调执行完才可以，所以，setTimeout把代码变成异步
            } catch (error) {
                reject(error)
            }   
          }, 0);
        })

      }
    })

    // if (this.status === FULFILLED) {
    //   // 成功回调
    //   successCallBack(this.value)
    // } else if (this.status === REJECTED) {
    //   // 失败回调
    //   failCallBack(this.reason)
    // } else {
    //   // 等待状态的时候
    //   // 如果回调的时候有异步操作，那么调then()方法的时候不知道去调用哪个
    //   // this.successCallBack = successCallBack
    //   // this.failCallBack = failCallBack
    //   this.successCallBack.push(successCallBack)
    //   this.failCallBack.push(failCallBack)
    // }

    return promise2
  }

  // 无论成功与否都会执行一次，也要返回promise对象
  finally(callBack) {
    // 获取当前状态，通过then()
    return this.then(value => {
      // 如果出现异步，这里直接用resolve把callBack转成promise对象，等待callBack里的执行完
      return MyPromise.resolve(callBack()).then(() => value )
      // callBack()
      // return value // 把成功的结果传递到下一个then
    }, reason => {
      return MyPromise.resolve(callBack()).then(() => { throw reason } )
      // callBack()
      // throw reason // 失败的话把失败结果通过throw传递到下一个
    })

  }

  // 只接收失败回调
  catch(failCallBack) {
    return this.then(undefined, failCallBack)
  }

  // all 方法 传入一个数组
  static all (array) {
    let result = []
    let index = 0
    
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value
        index++
        // 此处判断index和数组长度array.length,相等说明都执行完了
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i< array.length; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          // promise 对象
          current.then((value) => {
            addData(i, value)
          }, (reason) => {
            reject(reason) // 有一个失败
          })
        } else {
          // 普通值 直接存
          addData(i, current)
        }
      }
      // resolve(result) // 全部成功后把值传递出去,注意，如果array的数组中，有promise对象，并且是异步时，上面需要处理
    })
  }

  // resolve
  static resolve (value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
    
  }
}
function resolvePromise (n, resolve, reject, promise2) {
  // 如果then方法返回的对象和当前的对象相等时，就抛出异常，return不再继续往下执行
  if (n === promise2) {
    return reject(new TypeError('循环调用了'))
  }

  // 判断是Promise对象，还是普通值
  if (n instanceof MyPromise) {
    // 对象的话，如果是成功状态就调用resolve,失败reject
    // n.then(value => resolve(value), reason => reject(reason))
    n.then(resolve, reject)
  } else {
    // 普通值  
    resolve(n)
  }
}
// 使用commonJS的模块导出myPromise
module.exports = MyPromise