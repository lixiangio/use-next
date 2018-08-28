<!-- Koa风格的嵌套中间件实现，用于异步队列流程控制 -->

中间件设计结构可分为水平和嵌套两种，相比水平结构，嵌套结构可实现更加精细的流程控制。

use-next采用圈模型的嵌套结构，由于圈模型中间件的层层包裹特征，使其拥有更加灵活的后置处理能力。

### 水平结构

```js
// 全部执行

          ________________ ___________ _________ __________
         |                |           |         |          |
[ middleware A ]  [ middleware B ] before [ controller ] after 


// 部分执行

          ________________ ___________
         |                |           |
[ middleware A ]  [ middleware B ] before [ controller ] after 
```

### 嵌套结构

```js
// 全部执行

         ____next____    ___next___     _________    ____________
        |            |  |          |   |         |  |            |
[ middleware A [ middleware B [ controller ] middleware B ] middleware A ]

// 跳跃执行

         ____next____    ________________________    ____________
        |            |  |                        |  |            |
[ middleware A [ middleware B [ controller ] middleware B ] middleware A ]
```

### Install

      npm install use-next

### 为什么有async/await还要使用中间件

async/await、promise只负责让异步代码同步执行，并不能实现业务流程控制、代码分离、代码规范和复用等功能。中间件除了能实异步转同步的需求外，同时还拥有很好的扩展性。

### 对比Promise

#### Promise

在使用Promise时一个Promise只能处理一个异步任务，多个异步队列需要搭配Promise.all()或Promise.race()来使用，否则又会面临嵌套问题，这其实是一种糟糕的实现方式。

```js
// 不使用async/await
let p1 = new Promise(function(resolve, reject){
    resolve(1)
})

let p2 = new Promise(function(resolve, reject){
    resolve(1)
})

Promise.all([p1, p2]).then(data => {
  console.log(data);
});


// 使用async/await
async function run() {

    let p1 = await new Promise(function(resolve, reject){
        resolve(1)
    })

    let p2 = await new Promise(function(resolve, reject){
        resolve(1)
    })

}

run()
```

#### use-next

在use-next中，你可以直接链式声明多个异步函数，通过next()方法可以选择在任意节点继续执行还是中断，同时支持后置处理功能。

自动模式下会隐式创建一个Promise实例，在多个异步队列中共享状态，仅使用单个Promise即可实现通常需要多个Promise才能完成的任务。

```js
async function run() {

    await usenext.use(function (ctx, next) {
       next()
    }).use(function (ctx, next) {
       next()
    }).use(function (ctx, next) {
       next()
    })

}
```


### 应用场景

* 多层异步流程控制，如koa

* 实现自定义异步函数链，如macaca脚本的函数链

* 代替Promise处理多个异步队列

* 不支持async/await、promise的异步降级方案

### 启动模式

启动模式分为自动模式和手动模式。由于两者通常是二选一，因此没有做集成处理。

#### 手动模式

默认引用为手动模式，通过预定义中间件，使用usenext.start()方法启动中间件队列，不支持Promise。

#### 示例

```js
let useNext = require('use-next')

let usenext = new useNext()

usenext.use(function (ctx, next) {
   setTimeout(() => {
      console.log(1)
      next()
   }, 1000);
}).use((ctx, next) => {
   setTimeout(() => {
      console.log(2)
      next()
   }, 1000);
}).use((ctx,next) => {
   setTimeout(() => {
      console.log(3)
      next()
   }, 1000);
}).then(function (data) {
   console.error('then', data)
}).catch(function (error) {
   console.error('catch', error)
})

usenext.start()
```

#### 自动模式

自动模式下会即时启动，需要引用require('use-next/auto')，支持Promise。

```js
let useNext  = require('use-next/auto')

let usenext = new useNext()

async function run() {

   let body = await usenext.use(function (ctx, next) {
      setTimeout(() => {
         console.log(ctx.body)
         ctx.body = 1
         next()
      }, 1000);
   }).use((ctx, next) => {
      setTimeout(() => {
         console.log(ctx.body)
         ctx.body = 2
         next()
      }, 1000);
   }).use((ctx, next) => {
      setTimeout(() => {
         console.log(ctx.body)
         ctx.body = 3
         ctx.resolve(ctx.body)
      }, 1000);
   }).catch(function (error) {
      console.error("error", error)
   })

   console.log(body)

}
```


## API

### class useNext(ctx)

* ctx `Object` ctx上下文扩展

### this.middlewares

中间件队列

### this.index

当前使用的中间件序列id

### this.use(func)

* func(ctx, next) `Function` 回调函数，支持async函数和箭头函数

    * ctx `Object` 异步执行上下文

    * next `Function` 切换至下一个中间件

### this.start()

手动触发useNext实例执行


### 仿Promise风格异步函数链

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