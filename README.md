嵌套函数扁平化，使用中间件函数链代替异步嵌套函数，通过next方法进行流程控制。

### Installation

      npm install use-next

### 使用示例

      let useNext = require('use-next')

      let taskFlow = new useNext()

      let test = ''

      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            test += 1
            console.log(test)
            next()
         }, 1000);
      }).use(function (ctx, next) {
         setTimeout(() => {
            test += 2
            console.log(test)
            next()
         }, 1000);
      }).use(function (ctx, next) {
         setTimeout(() => {
            test += 3
            console.log(test)
            next()
         }, 1000);
      }).use(function (ctx) {
         setTimeout(() => {
            test += 4
            console.log(test)
         }, 1000);
      })

      taskFlow.start()

