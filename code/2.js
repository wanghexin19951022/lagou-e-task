const fp = require('lodash/fp')
// 数据
// horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
  {
    name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true
  },
  {
    name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false
  },
  {
    name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false
  },
  {
    name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false
  },
  {
    name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: false
  },
  {
    name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false
  }
]

// 1、使用函数组合fp.flowRight()重新实现下面这个函数
/*
  let isLastInStock = function (cars) {
    // 获取最后一套数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的in_stock属性值
    return fp.prop('in_stock', last_car)
  }
*/
const isLastInStock = cars => fp.last(cars)
const getProp = last_car => fp.prop('in_stock', last_car)
const value = fp.flowRight(getProp ,isLastInStock)
console.log(value(cars)) // false

// 2、使用fp.flowRight()、fp.prop()、fp.first()获取第一个car的name

const getFirstData = cars => fp.first(cars)
const getName = first_car => fp.prop('name', first_car)
const firstValue = fp.flowRight(getName ,getFirstData)
console.log(firstValue(cars)) // Ferrari FF


// 3、使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
} // 无须改动

// // 待改造代码
// /*
// let averageDollarValue = function (cars) {
//   let dollar_values = fp.map(function (car) {
//     return car.dollar_value
//   }, cars)
//   return _average(dollar_values)
// }
// */
// // 改造之后代码
let averageDollarValue = cars => fp.map((car) => { return car.dollar_value } , cars )
let average = fp.flowRight(_average, averageDollarValue)
console.log(average(cars)) // 790700


// 4、使用flowRight 写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name
//    转换为这种形式：例如：sanitizeNames(["Hello World"]) => ["hello_world"]

let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在sanitizeNames中使用它
// 思路=>先遍历数组，把其中的元素的大写字母转换为小写，紧接着替换空格为下划线
let lowerCase = str => fp.lowerCase(str)
let longstr = arr => arr.join(',')
let sanitizeNames = fp.flowRight(fp.split(','),_underscore, lowerCase,longstr)
console.log(sanitizeNames(["Hello World"]))