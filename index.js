class task {
   constructor() {
      this.index = 0
      this.middlewares = []
   }
   use(fn) {
      this.middlewares.push(fn)
      return this
   }
   async start() {
      this.index = -1
      await this.next()
   }
   async next() {
      let func = this.middlewares[this.index + 1]
      if (func) {
         let lock = true
         await func(this, () => {
            if (lock) {
               this.index++
               lock = false
               this.next()
            }
         })
      }
   }
}

module.exports = task