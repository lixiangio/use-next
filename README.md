多层嵌套函数的优雅写法，使用声明式函数链将嵌套代码转为水平代码，通过next方法实现灵活的流程控制。

ES5编写，不需要降级。


### Installation

      npm install use-next

### 使用方法

      let useNext = require('use-next')

      let taskFlow = new useNext()

      let test = ''
      taskFlow.use(function () {
         setTimeout(() => {
            test += 1
            this.next()
         }, 1000);
      }).use(function () {
         setTimeout(() => {
            test += 2
            this.next()
         }, 1000);
      }).use(function () {
         setTimeout(() => {
            test += 3
            console.log(test) // 输出 123
         }, 1000);
      })

      taskFlow.start()

