let task = require('.')

let taskFlow = new task()

let test = ''
taskFlow.use(function (ctx, next) {
   test += 1
   next()
   test += 1
}).use((ctx, next) => {
   test += 2
   ctx.next()
   test += 2
}).use((ctx, next) => {
   test += 3
})

taskFlow.start()

console.log(test)
