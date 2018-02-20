let task = require('.')

let taskFlow = new task()

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

console.log(test)


