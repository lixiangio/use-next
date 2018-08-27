/**
 * 运行时动态定义中间件
 * 自动执行，免start()
 */
class useNext {
   /**
    * 
    * @param {Object} mixin 混合对象，优先级低于内置对象
    */
   constructor(mixin = {}) {

      Object.assign(this, mixin)
      this.index = -1
      this.useCount = -1
      this.middlewares = []
      this.sync = true

      let promise = new Promise((resolve, reject) => {
         this.resolve = resolve
         this.reject = reject
      })

      Object.assign(promise, this)

      for (let name of ['use', 'start', 'next']) {
         promise[name] = this[name]
      }

      return promise

   }
   /**
    * 添加中间件
    * 如果起始中间件为连续的同步中间件(---oo-o-ooo)时，一个同步中间件执行完毕后，需要再次调用use()才能有新的中间件可用，由于同步代码的原因，此时的next()为不可用状态。
    * 解决方案是在每次使用use添加中间件时判断是否为异步分隔点，如果是则切换到到异步模式。
    * 异步模式下中间件不存在阻塞问题，因为同步的use()始终优先执行，在执行next()前所有的中间件都已经准备就绪。
    * @param {Function} func 中间件函数
    */
   use(func) {
      if (!(func instanceof Function)) return
      this.middlewares.push(func)
      // 同步执行
      if (this.sync) {
         if (this.index === this.useCount++) {
            this.next()
         } else {
            this.sync = false
         }
      }
      return this
   }
   /**
    * 切换到下一个中间件
    * 包含状态锁，禁止重复调用
    */
   async next() {
      let func = this.middlewares[this.index + 1]
      if (func) {
         let lock = true
         await func(this, () => {
            if (lock) {
               lock = false
               this.index++
               // 异步执行
               if (this.sync === false) {
                  this.next()
               }
            }
         })
      } else {
         this.resolve(this)
      }
   }
}

module.exports = useNext