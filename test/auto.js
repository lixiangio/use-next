let useNext = require('../auto')

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