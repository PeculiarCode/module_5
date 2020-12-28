### 当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})

// name不是响应式数据
// 设置成响应式数据
this.$set(dog,'name','Trump')

// 原理分析
// 1 通过Object.definePropertd的get方法依赖收集所有观察者传递给watcher
// 2 触发set方法通知watcher
// 3 在watcher调用回调函数更新数据重新渲染视图
// 4 将新增的数据重新添加对应的getter和settter

```

### diff 算法

            订阅者setter
                ↓
            Dep.notify-----------------------------------------------
                ↓                                                   ↑
        patch(oldValue,Vnode)                                       |
                ↓                                                   |
        no ← isSameVnode → yes                                      |
         ↓                  ↓                                       |
      replace            pachVnode                              diff算法
         ↓                  | → oldVnode有子节点,Vnode没有           |
      return Vnode          | → oldVnode没有子节点,Vnode有           |
                            | → 都只有文本节点                       |
                            | → 都只有子节点                         ↓
                            -----------------------------------------
