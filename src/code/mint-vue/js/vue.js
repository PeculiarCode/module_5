//模拟vue的响应式原理
class Vue {
  constructor(options) {
    //1 通过属性保存选项数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    // 将data成员转换对应的getter/setter注入到vue实例
    this._proxyData(this.$data)
    // 3 调用observe对象,监听数据变化
    new Observer(this.$data)
    // 4 调用compiler对象,解析指令和表达式
    new Compiler(this)
  }
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      //将data属性注入Vue实例
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}
