<!-- 使用嵌套中间件风格的异步队列流程控制器。 -->

中间件设计结构可分为水平和嵌套两种，use-next采用圈模型的嵌套结构，相比水平结构，嵌套结构支持更加精细的流程控制。

### 水平结构

```js
       _______________________________________________________________
      |           |        |           |          |       |           |
[ middleware ]  after   before  [ middleware ]  after   before  [ controller ]
```

### 嵌套结构

```js
// 全部执行

       ___next___     ___next___   __next___    ____next____
      |          |   |           |          |  |            |
[ middleware [ middleware [ controller ] middleware ] middleware ]

// 跳跃式执行
       _________________________next________________________
      |                                                     |
[ middleware [ middleware [ controller ] middleware ] middleware ]
```

### Install

      npm install use-next

### 为什么有async/await还要使用中间件

async/await、promise只负责让异步代码同步执行，并不能实现业务流程控制、代码分离、代码规范和复用等功能。中间件除了能实异步转同步的需求外，同时还拥有很好的扩展性。

## 应用场景

* 多层异步流程控制，如koa

* 实现异步函数链，如macaca脚本的函数链

* 不支持async/await、promise的IE浏览器异步解决方案

### 使用示例

```js
let useNext = require('use-next')

let taskFlow = new useNext()

let test = ''

taskFlow.use(function (ctx, next) {
   setTimeout(() => {
      test += 1
      console.log(test)
      next()
   }, 2500);
}).use(function (ctx, next) {
   setTimeout(() => {
      test += 2
      console.log(test)
      next()
   }, 2000);
}).use(function (ctx, next) {
   setTimeout(() => {
      test += 3
      console.log(test)
      next()
   }, 1500);
}).use(function (ctx) {
   setTimeout(() => {
      test += 4
      console.log(test)
   }, 1000);
})

taskFlow.start()
```