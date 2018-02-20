针对嵌套回调函数的优雅解决方案，使用声明式函数链将多层嵌套结构代码转为水平结构，通过next方法递进。

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
            console.log(test)
         }, 1000);
      })

      taskFlow.start()

