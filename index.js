class task {
   constructor() {
      this.middleware = []
      this.index = 0
   }
   use(fn) {
      this.middleware.push(fn)
      return this
   }
   async next() {
      let fn = this.middleware[++this.index]
      await fn(this, async () => {
         await this.next()
      })
   }
   start() {
      this.middleware[0](this, async () => {
         await this.next()
      })
   }
}

module.exports = task