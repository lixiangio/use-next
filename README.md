使用中间件风格的函数链取代异步嵌套函数，通过next方法进行流程管控，编写扁平化可复用的异步代码。

### Installation

      npm install use-next

### 为什么有async/await还要使用中间件

async/await、promise只负责让异步代码同步执行，并不能实现业务流程控制、代码分离、代码规范和复用等功能。中间除了能实异步转同步的需求外，同时还拥有很强的扩展性。


### 使用示例

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