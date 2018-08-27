let useNext = require('..')

let usenext = new useNext({ test: 0 })

usenext.use(function (ctx, next) {
   console.log(ctx.test)
   next()
   console.log(ctx.test)
}).use((ctx, next) => {
   ctx.test += 2
   console.log(ctx.test)
   next()
   ctx.test += 2
}).use((ctx) => {
   ctx.test += 3
   console.log(ctx.test)
})

usenext.start()