let useNext = require('../promise')

let usenext = new useNext()

async function run() {

   await usenext.use(function (ctx, next) {
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
         // ctx.reject(3)
      }, 1000);
   }).then(function (data) {
      console.error('then', data)
   }).catch(function (error) {
      console.error('catch', error)
   })

   console.log(4)

}

run()