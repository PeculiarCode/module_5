//负责把data属性转换响应式数据
//数据变化发送通知
class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        //1 判断data是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2 遍历data所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        const that = this
        //依赖收集发送通知
        let dep = new Dep()
        //如果val是对象.把val内部的属性转换成响应式数据
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
             
                //收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newValue) {
                if (newValue === val) {
                    return
                }
                val = newValue
                that.walk(newValue)
                //发送通知
                dep.notify()
            }
        })
    }
}
