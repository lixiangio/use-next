/**
 * 预定义中间件（静态）
 * 在所有中间件就绪后，通过start()启动执行
 */
class useNext {
   constructor(mixin) {
      Object.assign(this, mixin)
      this.index = 0
      this.middlewares = []
   }
   use(func) {
      if (!(func instanceof Function)) return
      this.middlewares.push(func)
      return this
   }
   start() {
      this.index = -1
      this.next()
   }
   next() {
      let func = this.middlewares[this.index + 1]
      if (func) {
         let lock = true
         func(this, () => {
            if (lock) {
               this.index++
               lock = false
               this.next()
            }
         })
      }
   }
}

module.exports = useNext