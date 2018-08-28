let useNext = require('../promise')

let usenext = new useNext({ body: 0 })

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
   }).use((ctx) => {
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

run()