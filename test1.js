let task = require('.')

let taskFlow = new task()

let test = ''
taskFlow.use(function (ctx, next) {
   setTimeout(() => {
      test += 1
      console.log(test)
      next()
   }, 2500);
}).use(function (ctx, next) {
   setTimeout(() => {
      test += 2
      console.log(test)
      next()
   }, 2000);
}).use(function (ctx, next) {
   setTimeout(() => {
      test += 3
      console.log(test)
      next()
   }, 1500);
}).use(function (ctx) {
   setTimeout(() => {
      test += 4
      console.log(test)
   }, 1000);
})

taskFlow.start()


