class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    //data属性key
    this.key = key
    //回调更新视图
    this.cb = cb
    //把Watcher对象记录到Dep类的静态属性target
    Dep.target = this
    //触发get方法,在get中调用addSub
    this.oldValue = vm[key]
    Dep.target = null
  }
  //数据变化更新视图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
  //处理点击事件
  emit() {
    console.log('emit')
  }
}
