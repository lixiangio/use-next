let task = require('.')

let taskFlow = new task()

let test = ''
taskFlow.use(function () {
   test += 1
   this.next()
   test += 1
}).use((ctx) => {
   test += 2
   ctx.next()
   test += 2
}).use((ctx) => {
   test += 3
   ctx.next()
   test += 3
})

taskFlow.start()

console.log(test)
