let useNext = require('..')

let usenext = new useNext({ data: '' })

usenext.use(function (ctx, next) {
   setTimeout(() => {
      ctx.data += 1
      console.log(ctx.data)
      next()
   }, 2500);
}).use(function (ctx, next) {
   setTimeout(() => {
      ctx.data += 2
      console.log(ctx.data)
      next()
   }, 2000);
}).use(function (ctx, next) {
   setTimeout(() => {
      ctx.data += 3
      console.log(ctx.data)
      next()
   }, 1500);
}).use(function (ctx) {
   setTimeout(() => {
      ctx.data += 4
      console.log(ctx.data)
   }, 1000);
})

usenext.start()


