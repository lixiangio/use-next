// class task {
//    constructor() {
//       this.middleware = []
//       this.index = 0
//    }
//    use(fn) {
//       this.middleware.push(fn)
//       return this
//    }
//    next() {
//       let fn = this.middleware[++this.index]
//       fn && (fn.prototype ? fn.call(this, this) : fn(this))
//    }
//    start() {
//       this.middleware[0].call(this, this)
//    }
// }

function task() {
   this.middleware = []
   this.index = 0
   this.use = function (fn) {
      this.middleware.push(fn)
      return this
   }
   this.next = function () {
      let fn = this.middleware[++this.index]
      fn && (fn.prototype ? fn.call(this, this) : fn(this))
   }
   this.start = function () {
      this.middleware[0].call(this, this)
   }
}

module.exports = task