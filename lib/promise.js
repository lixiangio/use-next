module.exports = function (options) {

   let promise = {}
   for (let name in options) {
      let func = options[name]
      promise[name] = function (...args) {
         let itemPromise = new Promise(function (resolve, reject) {
            func.call({ resolve, reject }, ...args)
         })
         Object.assign(itemPromise, promise)
         return itemPromise
      }
   }

   // for (let name in promise) {
   //    let func = promise[name]
   //    Object.assign(func, promise)
   // }

   return promise

}