let task = require('..')

let taskFlow = new task()





let chain = {
   sleep(time) {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log(`等待${time}毫秒`)
            next()
         }, time);
      })
      return this
   },
   url(url) {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log(`打开${url}`)
            next()
            next()
            next()
            next()
            next()
         }, 3000);
      })
      return this
   },
   find(selector) {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log(`查找${selector}元素`)
            next()
         }, 2000);
      })
      return this
   },
   val(text) {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log(`输入关键词"${text}"`)
            next()
         }, 1500);
      })
      return this
   },
   submit() {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log(`提交搜索`)
            next()
         }, 500);
      })
      return this
   },
   title() {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log('获取标题："hello_百度搜索"')
            next()
         }, 2500);
      })
      return this
   },
   close() {
      taskFlow.use(function (ctx, next) {
         setTimeout(() => {
            console.log('关闭网页')
         }, 100);
      })
      taskFlow.start()
   }
}

chain.url('https://www.baidu.com/')
   .find('#kw')
   .sleep(1000)
   .val('hello')
   .submit()
   .title()
   .sleep(1500)
   .close()