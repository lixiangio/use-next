<!-- Koa风格的嵌套中间件实现，用于异步队列流程控制 -->

中间件设计结构可分为水平和嵌套两种，相比水平结构，嵌套结构可实现更加精细的流程控制。

use-next采用圈模型的嵌套结构，由于圈模型中间件的层层包裹特征，使其拥有更加灵活的后置处理能力。

### 水平结构

```js
// 全部执行
       ________________ _________ ___________ _________
      |                |         |           |         |
[ middleware ]  [ middleware ] before [ controller ] after 


// 部分执行
       ________________ __________
      |                |          |
[ middleware ]  [ middleware ] before [ controller ] after 
```

### 嵌套结构

```js
// 全部执行

       ___next___     ___next____ __________    ____________
      |          |   |           |          |  |            |
[ middleware [ middleware [ controller ] middleware ] middleware ]

// 跳跃执行

       ___next___     ______________________    ____________
      |          |   |                      |  |            |
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

## 启动模式

启动模式分为自动模式和手动模式。由于两者通常是二选一，因此没有做集成处理。

默认引用为手动模式，需要用usenext.start()触发执行中间件队列。

自动模式需要使用require('use-next/auto')，在调用usenext.use()时动态执行。

```js
let useNext  = require('use-next/auto')
let usenext = new useNext()

// 包装后效果，完整示例请参考下面的仿Promise异步队列示例
chain.url('https://www.baidu.com/')
   .find('#kw')
   .sleep(1000)
   .val('hello')
   .submit()
   .title()
   .sleep(1500)
   .close()
```


## API

### class useNext(mixin)

* mixin `Object` 实例混合选项，用于this、ctx属性扩展

### this.middlewares

中间件队列

### this.index

当前使用的中间件序列id

### this.use(func)

* func(ctx, next) `Function` 异步函数

    * ctx `Object` useNext实例，指向this

    * next `Function` 切换至下一个中间件

### this.start()

手动触发useNext实例执行


## 基础示例

```js
let useNext = require('use-next')

let usenext = new useNext()

let test = ''

usenext.use(function (ctx, next) {
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
   }, 1500);
})

usenext.start()
```

## 仿Promise风格异步队列

```js
let useNext = require('use-next')

let usenext = new useNext()

let chain = {
   url(url) {
      usenext.use(function (ctx, next) {
         setTimeout(() => {
            ctx.data = `打开${url}`
            next()
         }, 3000);
      })
      return this
   },
   find(selector) {
      usenext.use(function (ctx, next) {
         setTimeout(() => {
            ctx.data = `查找${selector}元素`
            // ctx.error = '未找到${selector}元素'
            next()
         }, 2000);
      })
      return this
   },
   val(text) {
      usenext.use(function (ctx, next) {
         ctx.data = `输入关键词"${text}"`
         next()
      })
      return this
   },
   submit() {
      usenext.use(function (ctx, next) {
         setTimeout(() => {
            ctx.data = `提交搜索`
            next()
         }, 500);
      })
      return this
   },
   title() {
      usenext.use(function (ctx, next) {
         ctx.data = '获取标题："hello_百度搜索"'
         next()
      })
      return this
   },
   close() {
      usenext.use(function (ctx, next) {
         setTimeout(() => {
            ctx.data = '关闭网页'
         }, 100);
      })
      return this
   },
   then(func) {
      usenext.use(function (ctx, next) {
         if (!ctx.error) {
            func(ctx.data)
         }
         next()
      })
      return this
   },
   catch(func) {
      usenext.use(function (ctx, next) {
         if (ctx.error) {
            func(ctx.error)
         } else {
            next()
         }
      })
      return this
   },
   sleep(time) {
      usenext.use(function (ctx, next) {
         setTimeout(() => {
            ctx.data = `等待${time}毫秒`
            next()
         }, time);
      })
      return this
   },
}


chain.url('https://www.baidu.com/')
   .then(function (data) {
      console.log(data)
   })
   .find('#kw')
   .then(function (data) {
      console.log(data)
   })
   .catch(function (error) {
      console.log(error)
   })
   .sleep(1000)
   .then(function (data) {
      console.log(data)
   })
   .val('hello')
   .then(function (data) {
      console.log(data)
   })
   .submit()
   .then(function (data) {
      console.log(data)
   })
   .title()
   .then(function (data) {
      console.log(data)
   })
   .sleep(1500)
   .then(function (data) {
      console.log(data)
   })
   .close()
   .then(function (data) {
      console.log(data)
   })
```